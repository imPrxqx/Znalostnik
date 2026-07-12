using Newtonsoft.Json.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace backend.Utils
{
    public record Result
    {
        public bool IsSuccess { get; }
        public bool IsFailure => !IsSuccess;
        public Error Error { get; }

        protected Result(bool isSuccess, Error error)
        {
            IsSuccess = isSuccess;
            Error = error;
        }

        public static Result Success()
        {
            return new Result(true, Errors.None);
        }

        public static Result Failure(Error error)
        {
            return new Result(false, error);
        }
    }

    public record Result<T> : Result
    {
        private T? _value;

        public T Value
        {
            get
            {
                if (!IsSuccess)
                {
                    throw new InvalidOperationException("Result is failure");
                }
                return _value!;
            }
        }

        private Result(T value)
            : base(true, Errors.None)
        {
            if (value == null)
            {
                throw new ArgumentNullException("Null value");
            }

            _value = value;
        }

        private Result(Error error)
            : base(false, error)
        {
            _value = default;
        }

        public static Result<T> Success(T value)
        {
            return new Result<T>(value);
        }

        public static new Result<T> Failure(Error error)
        {
            return new Result<T>(error);
        }
    }

    public record Error(string Type, string Description);

    public static class Errors
    {
        public static Error None = new Error("Errors.None", "None error");

        public static Error UnauthorizedAccess = new Error(
            "Errors.UnauthorizedAccess",
            "Unauthorized Access"
        );

        public static Error NotFound = new Error("Errors.NotFound", "Value Not Found");

        public static Error UserNotFound = new Error("Errors.UserNotFound", "User Not Found");

        public static Error SessionNotFound = new Error(
            "Errors.SessionNotFound",
            "Session Not Found"
        );

        public static Error TagNotFound = new Error("Errors.TagNotFound", "Tag Not Found");

        public static Error SessionNotOpen = new Error("Errors.SessionNotOpen", "Session Not Open");

        public static Error SessionUserNotFound = new Error(
            "Errors.SessionUserNotFound",
            "Session User Not Found"
        );

        public static Error TeamNotFound = new Error("Errors.TeamNotFound", "Team Not Found");

        public static Error NotEverybodyHaveTeam = new Error(
            "Errors.NotEverybodyHaveTeam",
            "Not Everybody Have Team"
        );

        public static Error SubmissionNotFound = new Error(
            "Errors.SubmissionNotFound",
            "Submission Not Found"
        );

        public static Error AnswerNotFound = new Error("Errors.AnswerNotFound", "Answer Not Found");

        public static Error ExerciseNotFound = new Error(
            "Errors.ExerciseNotFound",
            "Exercise Not Found"
        );

        public static Error ExerciseActivityNotFound = new Error(
            "Errors.ExerciseActivityNotFound",
            "Exercise Activity Not Found"
        );

        public static Error InvalidOperation = new Error(
            "Errors.InvalidOperation",
            "Operation Is Not Valid"
        );

        public static Error AnswerAlreadyConfirmed = new Error(
            "Errors.AnswerAlreadyConfirmed",
            "Answer Is Already Confirmed And Cannot Be Modified"
        );

        public static Error NotYourTurn = new Error("Errors.NotYourTurn", "Not Your Turn");

        public static Error NotEnoughtParticipants = new Error(
            "Errors.NotEnoughtParticipants",
            "Not Enought Participants"
        );
    }
}
