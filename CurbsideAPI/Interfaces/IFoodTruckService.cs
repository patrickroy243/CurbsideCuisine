using CurbsideAPI.DTOs;
using Microsoft.AspNetCore.Http;

namespace CurbsideAPI.Interfaces
{
    public interface IFoodTruckService
    {
        Task<PaginatedResponse<FoodTruckResponseDto>> GetAllAsync(int pageNumber, int pageSize);
        Task<List<NearbyFoodTruckDto>> GetNearbyAsync(double latitude, double longitude, int radius);
        Task<ApiResponse<FoodTruckResponseDto>> GetByIdAsync(int id);
        Task<ApiResponse<FoodTruckResponseDto>> CreateAsync(FoodTruckCreateDto createDto);
        Task<ApiResponse<FoodTruckResponseDto>> UpdateAsync(int id, FoodTruckUpdateDto updateDto);
        Task<ApiResponse<bool>> UpdateLocationAsync(int id, double latitude, double longitude);
        Task<ApiResponse<bool>> UpdateStatusAsync(int id, bool isOpen);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<bool>> AddToFavoritesAsync(int id);
        Task<ApiResponse<bool>> RemoveFromFavoritesAsync(int id);
        Task<ApiResponse<List<FoodTruckResponseDto>>> GetUserFavoritesAsync();
        Task<ApiResponse<bool>> IsFavoriteAsync(int id);
        Task<ApiResponse<string>> UploadImageAsync(IFormFile imageFile);
    }
}