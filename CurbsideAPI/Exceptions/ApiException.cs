namespace CurbsideAPI.Exceptions
{
    public class ApiException : Exception
    {
        public ApiException(string message) : base(message) { }
        public ApiException(string message, Exception innerException) : base(message, innerException) { }
    }

    public class UnauthorizedApiException : ApiException
    {
        public UnauthorizedApiException(string message = "Unauthorized access") : base(message) { }
    }

    public class ForbiddenApiException : Exception
    {
        public ForbiddenApiException(string message = "Access forbidden") : base(message) { }
    }
}