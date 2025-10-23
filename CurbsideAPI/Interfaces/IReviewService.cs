using CurbsideAPI.DTOs;

namespace CurbsideAPI.Interfaces
{
    public interface IReviewService
    {
        Task<List<ReviewResponseDto>> GetAllAsync(int foodTruckId);
        Task<ApiResponse<ReviewResponseDto>> CreateAsync(int foodTruckId, ReviewCreateDto createDto);
        Task<ApiResponse<ReviewResponseDto>> UpdateAsync(int foodTruckId, int id, ReviewUpdateDto updateDto);
        Task<ApiResponse<bool>> DeleteAsync(int foodTruckId, int id);
        Task<ApiResponse<List<ReviewResponseDto>>> GetReviewsByFoodTruckIdAsync(int foodTruckId);
    }
}