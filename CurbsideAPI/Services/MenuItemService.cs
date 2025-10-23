using System.Security.Claims;
using AutoMapper;
using CurbsideAPI.Data;
using CurbsideAPI.DTOs;
using CurbsideAPI.Interfaces;
using CurbsideAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CurbsideAPI.Services
{
    public class MenuItemService : IMenuItemService
    {
        private readonly CurbsideDbContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MenuItemService(CurbsideDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<MenuItemResponseDto>> GetAllAsync(int foodTruckId)
        {
            try
            {
                var menuItems = await _context.MenuItems
                    .Include(m => m.FoodTruck)
                    .Where(m => m.FoodTruckId == foodTruckId)
                    .OrderBy(m => m.Name) 
                    .ToListAsync();

                return _mapper.Map<List<MenuItemResponseDto>>(menuItems);
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving menu items: " + ex.Message);
            }
        }

        public async Task<ApiResponse<MenuItemResponseDto>> CreateAsync(int foodTruckId, MenuItemCreateDto createDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var foodTruck = await _context.FoodTrucks
                    .FirstOrDefaultAsync(f => f.FoodTruckId == foodTruckId && f.OwnerId == userId);

                if (foodTruck == null)
                {
                    return new ApiResponse<MenuItemResponseDto>
                    {
                        Success = false,
                        Message = "Food truck not found or you don't have permission to add menu items."
                    };
                }

                var menuItem = _mapper.Map<MenuItem>(createDto);
                menuItem.FoodTruckId = foodTruckId;
                menuItem.CreatedAt = DateTime.UtcNow;

                _context.MenuItems.Add(menuItem);
                await _context.SaveChangesAsync();

                var responseDto = _mapper.Map<MenuItemResponseDto>(menuItem);
                responseDto.FoodTruckName = foodTruck.Name;

                return new ApiResponse<MenuItemResponseDto>
                {
                    Success = true,
                    Data = responseDto,
                    Message = "Menu item created successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<MenuItemResponseDto>
                {
                    Success = false,
                    Message = "Error creating menu item: " + ex.Message
                };
            }
        }

        public async Task<ApiResponse<MenuItemResponseDto>> UpdateAsync(int foodTruckId, int id, MenuItemUpdateDto updateDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var menuItem = await _context.MenuItems
                    .Include(m => m.FoodTruck)
                    .FirstOrDefaultAsync(m => m.MenuItemId == id && 
                                           m.FoodTruckId == foodTruckId && 
                                           m.FoodTruck.OwnerId == userId);

                if (menuItem == null)
                {
                    return new ApiResponse<MenuItemResponseDto>
                    {
                        Success = false,
                        Message = "Menu item not found or you don't have permission to update it."
                    };
                }

                _mapper.Map(updateDto, menuItem);
                await _context.SaveChangesAsync();

                var responseDto = _mapper.Map<MenuItemResponseDto>(menuItem);

                return new ApiResponse<MenuItemResponseDto>
                {
                    Success = true,
                    Data = responseDto,
                    Message = "Menu item updated successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<MenuItemResponseDto>
                {
                    Success = false,
                    Message = "Error updating menu item: " + ex.Message
                };
            }
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int foodTruckId, int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var menuItem = await _context.MenuItems
                    .Include(m => m.FoodTruck)
                    .FirstOrDefaultAsync(m => m.MenuItemId == id && 
                                           m.FoodTruckId == foodTruckId && 
                                           m.FoodTruck.OwnerId == userId);

                if (menuItem == null)
                {
                    return new ApiResponse<bool>
                    {
                        Success = false,
                        Data = false,
                        Message = "Menu item not found or you don't have permission to delete it."
                    };
                }

                _context.MenuItems.Remove(menuItem);
                var result = await _context.SaveChangesAsync();

                return new ApiResponse<bool>
                {
                    Success = result > 0,
                    Data = result > 0,
                    Message = result > 0 ? "Menu item deleted successfully" : "Failed to delete menu item"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    Data = false,
                    Message = "Error deleting menu item: " + ex.Message
                };
            }
        }

        public async Task<ApiResponse<MenuItemResponseDto>> GetByIdAsync(int foodTruckId, int id)
        {
            try
            {
                var menuItem = await _context.MenuItems
                    .Include(m => m.FoodTruck)
                    .FirstOrDefaultAsync(m => m.MenuItemId == id && m.FoodTruckId == foodTruckId);

                if (menuItem == null)
                {
                    return new ApiResponse<MenuItemResponseDto>
                    {
                        Success = false,
                        Message = "Menu item not found"
                    };
                }

                var responseDto = _mapper.Map<MenuItemResponseDto>(menuItem);

                return new ApiResponse<MenuItemResponseDto>
                {
                    Success = true,
                    Data = responseDto,
                    Message = "Menu item retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<MenuItemResponseDto>
                {
                    Success = false,
                    Message = "Error retrieving menu item: " + ex.Message
                };
            }
        }

        public async Task<ApiResponse<MenuItemResponseDto>> UpdateAvailabilityAsync(int foodTruckId, int id, bool isAvailable)
        {
            try
            {
                var userId = GetCurrentUserId();
                var menuItem = await _context.MenuItems
                    .Include(m => m.FoodTruck)
                    .FirstOrDefaultAsync(m => m.MenuItemId == id && 
                                           m.FoodTruckId == foodTruckId && 
                                           m.FoodTruck.OwnerId == userId);

                if (menuItem == null)
                {
                    return new ApiResponse<MenuItemResponseDto>
                    {
                        Success = false,
                        Message = "Menu item not found or you don't have permission to update it."
                    };
                }

                menuItem.IsAvailable = isAvailable;
                await _context.SaveChangesAsync();

                var responseDto = _mapper.Map<MenuItemResponseDto>(menuItem);

                return new ApiResponse<MenuItemResponseDto>
                {
                    Success = true,
                    Data = responseDto,
                    Message = $"Menu item availability updated to {(isAvailable ? "available" : "unavailable")}"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<MenuItemResponseDto>
                {
                    Success = false,
                    Message = "Error updating menu item availability: " + ex.Message
                };
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            throw new UnauthorizedAccessException("User ID not found in token");
        }
    }
}