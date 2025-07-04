using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

using backend.Managers;
using backend.Models;
using backend.Monitors;
using backend.Hubs;
using backend.Domain;

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

            builder.Services.AddIdentityCore<User>();

            // Login
            builder.Services.AddAuthorization();
            builder.Services.AddAuthentication().AddCookie(IdentityConstants.ApplicationScheme);
            builder.Services.AddIdentityCore<User>().AddEntityFrameworkStores<ApplicationDbContext>().AddApiEndpoints(); 

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

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString)
            );

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

            // SignalR
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // SignalR - Hubs
            app.MapHub<RoomHub>("/api/hub");

            // Login
            app.MapIdentityApi<User>();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
