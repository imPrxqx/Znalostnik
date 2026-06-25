using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace backend.Services.EmailSender
{
    public class EmailSender : IEmailSender
    {
        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var emailFrom = Environment.GetEnvironmentVariable("EMAIL")!;
            var emailPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD")!;

            using var client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(emailFrom, emailPassword),
                EnableSsl = true,
            };

            var mail = new MailMessage
            {
                From = new MailAddress(emailFrom),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true,
            };

            mail.To.Add(email);

            await client.SendMailAsync(mail);
        }
    }
}
