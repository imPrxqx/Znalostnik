using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace backend.Services.EmailSender
{
    /// <summary>
    /// Sends email to end users using SMTP with Google email.
    /// </summary>
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;

        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Sends from Google email to end user with his email
        /// </summary>
        /// <param name="email">End user email</param>
        /// <param name="subject">Email subject</param>
        /// <param name="htmlMessage">HTML message</param>
        /// <returns>Task send operation</returns>
        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var emailFrom = _configuration["EMAIL"]!;
            var emailPassword = _configuration["EMAIL_PASSWORD"]!;

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
