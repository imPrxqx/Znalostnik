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

        public static Result Success() => new(true, Errors.None);

        public static Result Failure(Error error) => new(false, error);

        public static implicit operator Result(Error error) => Failure(error);
    }

    public record Result<T> : Result
    {
        public T? Value { get; }

        private Result(T value)
            : base(true, Errors.None) => Value = value;

        private Result(Error error)
            : base(false, error) { }

        public static Result<T> Success(T value) => new Result<T>(value);

        public static new Result<T> Failure(Error error) => new Result<T>(error);
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

        public static Error InvalidOperation = new Error(
            "Errors.InvalidOperation",
            "Operation Is Not Valid"
        );
    }
}
