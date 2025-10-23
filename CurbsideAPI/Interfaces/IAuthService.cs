using CurbsideAPI.DTOs;
using CurbsideAPI.Models;

namespace CurbsideAPI.Interfaces
{
    public interface IAuthService
    {
        Task<User?> ValidateUserAsync(UserLoginDto loginDto);
        Task<ApiResponse<UserResponseDto>> RegisterAsync(UserRegisterDto registerDto);
        Task<ApiResponse<UserResponseDto>> LoginAsync(UserLoginDto loginDto);
        Task<ApiResponse<bool>> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<ApiResponse<UserResponseDto>> UpdateUserAsync(int userId, UserUpdateDto updateDto);
        Task<ApiResponse<UserResponseDto>> GetUserProfileAsync(int userId);
        Task<ApiResponse<bool>> DeleteUserAsync(int userId);
        Task<ApiResponse<bool>> UpdateUserLocationAsync(int userId, double latitude, double longitude);
        Task<ApiResponse<DashboardStatsDto>> GetDashboardStatsAsync();
    }
}