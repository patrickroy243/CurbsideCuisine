using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using CurbsideAPI.Data;
using CurbsideAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using CurbsideAPI.Models;
using CurbsideAPI.Interfaces;

public class FoodTruckService : IFoodTruckService
{
    private readonly CurbsideDbContext _context;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public FoodTruckService(CurbsideDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ApiResponse<FoodTruckResponseDto>> GetByIdAsync(int id)
    {
        var foodTruck = await _context.FoodTrucks
            .Include(f => f.Owner)
            .Include(f => f.MenuItems)
            .FirstOrDefaultAsync(f => f.FoodTruckId == id);

        if (foodTruck == null)
            throw new KeyNotFoundException("Food truck not found");

        return new ApiResponse<FoodTruckResponseDto>
        {
            Success = true,
            Data = _mapper.Map<FoodTruckResponseDto>(foodTruck)
        };
    }

    public async Task<PaginatedResponse<FoodTruckResponseDto>> GetAllAsync(int pageNumber, int pageSize)
    {
        var query = _context.FoodTrucks
            .Include(f => f.Owner)
            .Include(f => f.MenuItems)
            .Where(f => f.IsActive)
            .AsNoTracking();

        var total = await query.CountAsync();
        var foodTrucks = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResponse<FoodTruckResponseDto>
        {
            Items = _mapper.Map<List<FoodTruckResponseDto>>(foodTrucks),
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalItems = total,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<List<NearbyFoodTruckDto>> GetNearbyAsync(double latitude, double longitude, int radius)
    {
        var radiusInDegrees = radius / 111.0; 

        var nearbyFoodTrucks = await _context.FoodTrucks
            .Include(f => f.Owner)
            .Where(f => f.IsActive && 
                   Math.Abs(f.Latitude - latitude) <= radiusInDegrees &&
                   Math.Abs(f.Longitude - longitude) <= radiusInDegrees)
            .ToListAsync();

        var result = new List<NearbyFoodTruckDto>();
        
        foreach (var foodTruck in nearbyFoodTrucks)
        {
            var distance = CalculateDistance(latitude, longitude, foodTruck.Latitude, foodTruck.Longitude);
            if (distance <= radius)
            {
                result.Add(new NearbyFoodTruckDto
                {
                    FoodTruckId = foodTruck.FoodTruckId,
                    Name = foodTruck.Name,
                    Cuisine = foodTruck.Cuisine,
                    Latitude = foodTruck.Latitude,
                    Longitude = foodTruck.Longitude,
                    Distance = distance,
                    IsOpen = foodTruck.IsOpen,
                    AverageRating = foodTruck.AverageRating
                });
            }
        }

        return result.OrderBy(x => x.Distance).ToList();
    }

    private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371; 
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }

    public async Task<ApiResponse<FoodTruckResponseDto>> CreateAsync(FoodTruckCreateDto createDto)
    {
        var userId = GetCurrentUserId();
        
        var foodTruck = _mapper.Map<FoodTruck>(createDto);
        foodTruck.OwnerId = userId;
        foodTruck.IsActive = true;

        _context.FoodTrucks.Add(foodTruck);
        await _context.SaveChangesAsync();

        var createdFoodTruck = await GetByIdAsync(foodTruck.FoodTruckId);
        return createdFoodTruck;
    }

    public async Task<ApiResponse<FoodTruckResponseDto>> UpdateAsync(int id, FoodTruckUpdateDto updateDto)
    {
        var foodTruck = await _context.FoodTrucks
            .Include(f => f.Owner)
            .FirstOrDefaultAsync(f => f.FoodTruckId == id);

        if (foodTruck == null)
            throw new KeyNotFoundException("Food truck not found");

        if (!CanModifyFoodTruck(foodTruck))
            throw new UnauthorizedAccessException("You don't have permission to update this food truck");

        
        if (updateDto.Name != null)
            foodTruck.Name = updateDto.Name;
        if (updateDto.Description != null)
            foodTruck.Description = updateDto.Description;
        if (updateDto.Cuisine != null)
            foodTruck.Cuisine = updateDto.Cuisine;
        if (updateDto.Phone != null)
            foodTruck.Phone = updateDto.Phone;
        if (updateDto.Website != null)
            foodTruck.Website = updateDto.Website;
        if (updateDto.ImageUrl != null)
            foodTruck.ImageUrl = updateDto.ImageUrl;
        if (updateDto.Latitude.HasValue)
            foodTruck.Latitude = updateDto.Latitude.Value;
        if (updateDto.Longitude.HasValue)
            foodTruck.Longitude = updateDto.Longitude.Value;
        if (updateDto.IsActive.HasValue)
            foodTruck.IsActive = updateDto.IsActive.Value;
        if (updateDto.IsOpen.HasValue)
            foodTruck.IsOpen = updateDto.IsOpen.Value;

        await _context.SaveChangesAsync();

        return new ApiResponse<FoodTruckResponseDto>
        {
            Success = true,
            Data = _mapper.Map<FoodTruckResponseDto>(foodTruck),
            Message = "Food truck updated successfully"
        };
    }

    public async Task<ApiResponse<bool>> UpdateLocationAsync(int id, double latitude, double longitude)
    {
        var foodTruck = await _context.FoodTrucks
            .FirstOrDefaultAsync(f => f.FoodTruckId == id);

        if (foodTruck == null)
            throw new KeyNotFoundException("Food truck not found");

        if (!CanModifyFoodTruck(foodTruck))
            throw new UnauthorizedAccessException("You don't have permission to update this food truck's location");

        foodTruck.Latitude = latitude;
        foodTruck.Longitude = longitude;
        
        await _context.SaveChangesAsync();

        return new ApiResponse<bool>
        {
            Success = true,
            Data = true,
            Message = "Location updated successfully"
        };
    }

    public async Task<ApiResponse<bool>> UpdateStatusAsync(int id, bool isOpen)
    {
        var foodTruck = await _context.FoodTrucks
            .FirstOrDefaultAsync(f => f.FoodTruckId == id);

        if (foodTruck == null)
            throw new KeyNotFoundException("Food truck not found");

        if (!CanModifyFoodTruck(foodTruck))
            throw new UnauthorizedAccessException("You don't have permission to update this food truck's status");

        foodTruck.IsOpen = isOpen;
        
        await _context.SaveChangesAsync();

        return new ApiResponse<bool>
        {
            Success = true,
            Data = true,
            Message = $"Food truck status updated to {(isOpen ? "open" : "closed")}"
        };
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var foodTruck = await _context.FoodTrucks
            .FirstOrDefaultAsync(f => f.FoodTruckId == id);

        if (foodTruck == null)
            throw new KeyNotFoundException("Food truck not found");

        if (!CanModifyFoodTruck(foodTruck))
            throw new UnauthorizedAccessException("You don't have permission to delete this food truck");

        _context.FoodTrucks.Remove(foodTruck);
        await _context.SaveChangesAsync();

        return new ApiResponse<bool>
        {
            Success = true,
            Data = true,
            Message = "Food truck deleted successfully"
        };
    }

    public async Task<ApiResponse<bool>> AddToFavoritesAsync(int id)
    {
        var userId = GetCurrentUserId();
        
        var foodTruck = await _context.FoodTrucks
            .Include(f => f.FavoredByUsers)
            .FirstOrDefaultAsync(f => f.FoodTruckId == id);

        if (foodTruck == null)
            throw new KeyNotFoundException("Food truck not found");

        var user = await _context.Users
            .Include(u => u.FavoriteFoodTrucks)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
            throw new KeyNotFoundException("User not found");

        if (user.FavoriteFoodTrucks.Any(f => f.FoodTruckId == id))
        {
            return new ApiResponse<bool>
            {
                Success = false,
                Data = false,
                Message = "Food truck is already in favorites"
            };
        }

        user.FavoriteFoodTrucks.Add(foodTruck);
        await _context.SaveChangesAsync();

        return new ApiResponse<bool>
        {
            Success = true,
            Data = true,
            Message = "Food truck added to favorites"
        };
    }

    public async Task<ApiResponse<bool>> RemoveFromFavoritesAsync(int id)
    {
        var userId = GetCurrentUserId();
        
        var user = await _context.Users
            .Include(u => u.FavoriteFoodTrucks)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
            throw new KeyNotFoundException("User not found");

        var favoriteToRemove = user.FavoriteFoodTrucks.FirstOrDefault(f => f.FoodTruckId == id);
        if (favoriteToRemove == null)
        {
            return new ApiResponse<bool>
            {
                Success = false,
                Data = false,
                Message = "Food truck is not in favorites"
            };
        }

        user.FavoriteFoodTrucks.Remove(favoriteToRemove);
        await _context.SaveChangesAsync();

        return new ApiResponse<bool>
        {
            Success = true,
            Data = true,
            Message = "Food truck removed from favorites"
        };
    }

    public async Task<ApiResponse<List<FoodTruckResponseDto>>> GetUserFavoritesAsync()
    {
        var userId = GetCurrentUserId();
        
        var user = await _context.Users
            .Include(u => u.FavoriteFoodTrucks)
                .ThenInclude(f => f.Owner)
            .Include(u => u.FavoriteFoodTrucks)
                .ThenInclude(f => f.MenuItems)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
            throw new KeyNotFoundException("User not found");

        var favoriteDtos = _mapper.Map<List<FoodTruckResponseDto>>(user.FavoriteFoodTrucks);

        return new ApiResponse<List<FoodTruckResponseDto>>
        {
            Success = true,
            Data = favoriteDtos,
            Message = "User favorites retrieved successfully"
        };
    }

    public async Task<ApiResponse<bool>> IsFavoriteAsync(int id)
    {
        var userId = GetCurrentUserId();
        
        var isFavorite = await _context.Users
            .Where(u => u.UserId == userId)
            .SelectMany(u => u.FavoriteFoodTrucks)
            .AnyAsync(f => f.FoodTruckId == id);

        return new ApiResponse<bool>
        {
            Success = true,
            Data = isFavorite,
            Message = "Favorite status retrieved successfully"
        };
    }

    public async Task<ApiResponse<string>> UploadImageAsync(IFormFile imageFile)
    {
        try
        {
            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "foodtrucks");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            // Generate unique filename
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var filePath = Path.Combine(uploadsPath, fileName);

            // Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            // Return the URL path
            var imageUrl = $"/uploads/foodtrucks/{fileName}";

            return new ApiResponse<string>
            {
                Success = true,
                Data = imageUrl,
                Message = "Image uploaded successfully"
            };
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to upload image: {ex.Message}", ex);
        }
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            throw new UnauthorizedAccessException("User not authenticated");
        return userId;
    }

    private bool CanModifyFoodTruck(FoodTruck foodTruck)
    {
        var userId = GetCurrentUserId();
        var userRole = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value;

        return userRole == "admin" || foodTruck.OwnerId == userId;
    }
}