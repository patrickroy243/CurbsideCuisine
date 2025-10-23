using CurbsideAPI.DTOs;

namespace CurbsideAPI.Interfaces
{
    public interface IAdminService
    {
        Task<PaginatedResponse<UserResponseDto>> GetAllUsersAsync(int pageNumber, int pageSize);
        Task<ApiResponse<UserResponseDto>> GetUserByIdAsync(int id);
        Task<ApiResponse<bool>> ChangeUserRoleAsync(int id, string role);
        Task<ApiResponse<bool>> UpdateUserStatusAsync(int id, bool isActive);
        Task<ApiResponse<bool>> DeleteUserAsync(int id);
        Task<PaginatedResponse<FoodTruckResponseDto>> GetAllFoodTrucksAsync(int pageNumber, int pageSize);
        Task<ApiResponse<bool>> VerifyFoodTruckAsync(int id);
        Task<ApiResponse<bool>> SuspendFoodTruckAsync(int id);
        Task<ApiResponse<bool>> DeleteFoodTruckAsync(int id);
        Task<PaginatedResponse<ReviewResponseDto>> GetAllReviewsAsync(int pageNumber, int pageSize);
        Task<ApiResponse<bool>> DeleteReviewAsync(int id);
        Task<ApiResponse<AdminStatisticsDto>> GetStatisticsAsync();
        Task<ApiResponse<UserAnalyticsDto>> GetUserAnalyticsAsync();
        Task<ApiResponse<FoodTruckAnalyticsDto>> GetFoodTruckAnalyticsAsync();
        Task<PaginatedResponse<AdminLogDto>> GetSystemLogsAsync(int pageNumber, int pageSize, string? level, DateTime? from, DateTime? to);
    }
}