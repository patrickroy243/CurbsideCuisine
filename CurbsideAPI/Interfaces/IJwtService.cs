using System.Security.Claims;
using CurbsideAPI.Models;

namespace CurbsideAPI.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
        ClaimsPrincipal? ValidateToken(string token);
        bool IsTokenExpired(string token);
    }
}