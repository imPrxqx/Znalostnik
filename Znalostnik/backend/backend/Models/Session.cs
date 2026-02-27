using System.Text.Json;

namespace backend.Models
{
    public class Session
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public bool IsPublic { get; set; } = false;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? AccessCode { get; set; }
        public int CurrentTaskIndex { get; set; } = 0;
        public Guid ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;
        public string CreatedByUserId { get; set; } = string.Empty;
        public User CreatedByUser { get; set; } = null!;
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public ICollection<Team> Teams { get; set; } = new List<Team>();
        public ICollection<SessionUser> SessionUsers { get; set; } = new List<SessionUser>();

        public void Start()
        {
            Status = "Active";
        }

        public void End()
        {
            Status = "Inactive";
        }

        public void AddUser(string userId)
        {
            bool alreadyExists = SessionUsers.Any(u => u.UserId == userId);

            if (alreadyExists)
            {
                throw new Exception("Session user already exists");
            }

            var sessionUser = new SessionUser();
            sessionUser.UserId = userId;

            SessionUsers.Add(sessionUser);
        }

        public void NextTask()
        {
            if (CurrentTaskIndex >= Exercise.ExerciseTasks.Count - 1)
            {
                throw new Exception("No next tasks");
            }

            CurrentTaskIndex++;
        }

        public void PreviousTask()
        {
            if (CurrentTaskIndex == 0)
            {
                throw new Exception("No previous tasks");
            }

            CurrentTaskIndex--;
        }
    }
}
