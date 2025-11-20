using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using backend.Data;
using backend.Data.Repository;
using backend.Hubs;
using backend.Models;
using backend.Services;
using backend.Services.Legacy;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Login
            builder.Services.AddAuthorization();
            builder
                .Services.AddAuthentication(options =>
                {
                    options.DefaultScheme = IdentityConstants.ApplicationScheme;
                    options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
                })
                .AddCookie(IdentityConstants.ApplicationScheme)
                .AddBearerToken(IdentityConstants.BearerScheme);
            builder
                .Services.AddIdentityCore<User>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddApiEndpoints();
            builder.Services.ConfigureApplicationCookie(options =>
            {
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };
            });

            // Data Protection
            var isDesignTime = AppDomain
                .CurrentDomain.GetAssemblies()
                .Any(a => a.FullName!.StartsWith("Microsoft.EntityFrameworkCore.Design"));

            // Grader
            builder.Services.AddSingleton<Grader>();

            if (!isDesignTime)
            {
                //string X509CertificatePassword = Environment.GetEnvironmentVariable(
                //    "X509_CERTIFICATE_2_PASSWORD"
                //)!;
                //builder
                //    .Services.AddDataProtection()
                //    .PersistKeysToFileSystem(new DirectoryInfo("/app/keys"))
                //    .ProtectKeysWithCertificate(
                //        new X509Certificate2(
                //            "/certificates/certificate.pfx",
                //            X509CertificatePassword
                //        )
                //    );
            }

            // Logger
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();

            // Services
            //builder.Services.AddScoped<ISessionService, SessionService>();
            builder.Services.AddScoped<IUserService, UserService>();

            // Repositories
            builder.Services.AddScoped<IExerciseTagRepository, ExerciseTagRepository>();
            builder.Services.AddScoped<IExerciseRepository, ExerciseRepository>();
            builder.Services.AddScoped<IExerciseTaskRepository, ExerciseTaskRepository>();
            builder.Services.AddScoped<ISessionUserRepository, SessionUserRepository>();
            builder.Services.AddScoped<ISubmissionRepository, SubmissionRepository>();
            builder.Services.AddScoped<ITeamMemberRepository, TeamMemberRepository>();
            builder.Services.AddScoped<ISessionRepository, SessionRepository>();

            // Background
            //builder.Services.AddHostedService<RoomMonitor>();
            //builder.Services.AddSingleton<RoomManager>();

            // SignalR
            builder.Services.AddSignalR();

            // Database
            string server = Environment.GetEnvironmentVariable("DATABASE_SERVER")!;
            string database = Environment.GetEnvironmentVariable("DATABASE_NAME")!;
            string username = Environment.GetEnvironmentVariable("DATABASE_USER")!;
            string password = Environment.GetEnvironmentVariable("DATABASE_PASS")!;
            string connectionString =
                $"Server={server};Username={username};Database={database};Password={password}";
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString)
            );

            // Cors
            var allowedOrigins = builder
                .Configuration.GetValue<string>("allowedOrigins")!
                .Split(",");
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy
                        .WithOrigins(allowedOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
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

            // Cors
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseHttpsRedirection();

            // SignalR - Hubs
            app.MapGroup("/api").MapHub<SessionHub>("/hub");

            // Login
            app.MapGroup("/api/user").MapIdentityApi<User>().WithTags("User");
            app.MapControllers();

            app.Run();
        }
    }
}
