using backend.Domain;
using backend.Hubs;
using backend.Managers;
using backend.Models;
using backend.Monitors;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            // Login
            builder.Services.AddIdentityCore<User>();
            builder.Services.AddAuthorization();
            builder.Services.AddAuthentication().AddCookie(IdentityConstants.ApplicationScheme).AddBearerToken(IdentityConstants.BearerScheme);
            builder.Services.AddIdentityCore<User>().AddEntityFrameworkStores<ApplicationDbContext>().AddApiEndpoints();

            // Data Protection
            var isDesignTime = AppDomain.CurrentDomain.GetAssemblies().Any(a => a.FullName!.StartsWith("Microsoft.EntityFrameworkCore.Design"));

            if (!isDesignTime)
            {
                string X509CertificatePassword = Environment.GetEnvironmentVariable("X509_CERTIFICATE_2_PASSWORD")!;
                builder.Services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo("/app/keys")).ProtectKeysWithCertificate(new X509Certificate2("/certificates/certificate.pfx", X509CertificatePassword));
            }

            // Logger
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();

            // SignalR
            builder.Services.AddSignalR();

            // Background
            builder.Services.AddSignalR();
            builder.Services.AddHostedService<RoomMonitor>();
            builder.Services.AddSingleton<RoomManager>();

            // Database
            string server = Environment.GetEnvironmentVariable("DATABASE_SERVER")!;
            string database = Environment.GetEnvironmentVariable("DATABASE_NAME")!;
            string username = Environment.GetEnvironmentVariable("DATABASE_USER")!;
            string password = Environment.GetEnvironmentVariable("DATABASE_PASS")!;
            string connectionString = $"Server={server};Username={username};Database={database};Password={password}";
            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

            // Cors
            var allowedOrigins = builder.Configuration.GetValue<string>("allowedOrigins")!.Split(",");
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
                //app.UseSwagger();
                //app.UseSwaggerUI();

                app.UseSwagger(options =>
                {
                    options.RouteTemplate = "api/swagger/{documentName}/swagger.json";
                });

                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/api/swagger/v1/swagger.json", "My API V1");
                    options.RoutePrefix = "api/swagger";
                });

            //}

            app.UseHttpsRedirection();

            // Cors
            app.UseCors();

            // SignalR - Hubs
            app.MapGroup("/api").MapHub<RoomHub>("/hub");

            // Login
            app.MapGroup("/api").MapIdentityApi<User>();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
