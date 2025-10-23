using CurbsideAPI.DTOs;

namespace CurbsideAPI.Interfaces
{
    public interface IMenuItemService
    {
        Task<List<MenuItemResponseDto>> GetAllAsync(int foodTruckId);
        Task<ApiResponse<MenuItemResponseDto>> CreateAsync(int foodTruckId, MenuItemCreateDto createDto);
        Task<ApiResponse<MenuItemResponseDto>> UpdateAsync(int foodTruckId, int id, MenuItemUpdateDto updateDto);
        Task<ApiResponse<bool>> DeleteAsync(int foodTruckId, int id);
    }
}