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

        public static Error InvalidOperation = new Error(
            "Errors.InvalidOperation",
            "Operation Is Not Valid"
        );
    }
}
