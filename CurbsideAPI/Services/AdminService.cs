using AutoMapper;
using CurbsideAPI.Data;
using CurbsideAPI.DTOs;
using CurbsideAPI.Interfaces;
using CurbsideAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CurbsideAPI.Services
{
    public class AdminService : IAdminService
    {
        private readonly CurbsideDbContext _context;
        private readonly IMapper _mapper;

        public AdminService(CurbsideDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedResponse<UserResponseDto>> GetAllUsersAsync(int pageNumber, int pageSize)
        {
            var query = _context.Users.AsNoTracking();
            var total = await query.CountAsync();
            
            var users = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<UserResponseDto>
            {
                Items = _mapper.Map<List<UserResponseDto>>(users),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalItems = total,
                TotalPages = (int)Math.Ceiling(total / (double)pageSize)
            };
        }

        public async Task<ApiResponse<UserResponseDto>> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            return new ApiResponse<UserResponseDto>
            {
                Success = true,
                Data = _mapper.Map<UserResponseDto>(user)
            };
        }

        public async Task<ApiResponse<bool>> ChangeUserRoleAsync(int id, string role)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            if (!IsValidRole(role))
                throw new ArgumentException("Invalid role specified");

            user.Role = role;
            await _context.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = $"User role changed to {role} successfully"
            };
        }

        public async Task<ApiResponse<bool>> UpdateUserStatusAsync(int id, bool isActive)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            user.IsActive = isActive;
            await _context.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = $"User {(isActive ? "activated" : "deactivated")} successfully"
            };
        }

        public async Task<ApiResponse<bool>> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "User deleted successfully"
            };
        }

        public async Task<PaginatedResponse<FoodTruckResponseDto>> GetAllFoodTrucksAsync(int pageNumber, int pageSize)
        {
            var query = _context.FoodTrucks
                .Include(f => f.Owner)
                .Include(f => f.MenuItems)
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

        public async Task<ApiResponse<bool>> VerifyFoodTruckAsync(int id)
        {
            var foodTruck = await _context.FoodTrucks.FindAsync(id);
            if (foodTruck == null)
                throw new KeyNotFoundException("Food truck not found");

            foodTruck.IsActive = true;
            await _context.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Food truck verified successfully"
            };
        }

        public async Task<ApiResponse<bool>> SuspendFoodTruckAsync(int id)
        {
            var foodTruck = await _context.FoodTrucks.FindAsync(id);
            if (foodTruck == null)
                throw new KeyNotFoundException("Food truck not found");

            foodTruck.IsActive = false;
            await _context.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Food truck suspended successfully"
            };
        }

        public async Task<ApiResponse<bool>> DeleteFoodTruckAsync(int id)
        {
            var foodTruck = await _context.FoodTrucks.FindAsync(id);
            if (foodTruck == null)
                throw new KeyNotFoundException("Food truck not found");

            _context.FoodTrucks.Remove(foodTruck);
            await _context.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Food truck deleted successfully"
            };
        }

        public async Task<PaginatedResponse<ReviewResponseDto>> GetAllReviewsAsync(int pageNumber, int pageSize)
        {
            var query = _context.Reviews
                .Include(r => r.User)
                .Include(r => r.FoodTruck)
                .AsNoTracking();

            var total = await query.CountAsync();
            var reviews = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<ReviewResponseDto>
            {
                Items = _mapper.Map<List<ReviewResponseDto>>(reviews),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalItems = total,
                TotalPages = (int)Math.Ceiling(total / (double)pageSize)
            };
        }

        public async Task<ApiResponse<bool>> DeleteReviewAsync(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                throw new KeyNotFoundException("Review not found");

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Review deleted successfully"
            };
        }

        public async Task<ApiResponse<AdminStatisticsDto>> GetStatisticsAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalVendors = await _context.Users.CountAsync(u => u.Role == "vendor");
            var totalFoodTrucks = await _context.FoodTrucks.CountAsync();
            var activeFoodTrucks = await _context.FoodTrucks.CountAsync(f => f.IsActive);
            var totalReviews = await _context.Reviews.CountAsync();
            var averageRating = await _context.Reviews.AverageAsync(r => (double?)r.Rating) ?? 0;

            // Calculate start of current month
            var thisMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            
            // For now, since we don't have CreatedAt fields, let's just use simpler calculations
            // This would ideally filter by u.CreatedAt >= thisMonth and f.CreatedAt >= thisMonth
            var newUsersThisMonth = Math.Max(0, totalUsers - 10); // Placeholder calculation
            var newFoodTrucksThisMonth = Math.Max(0, totalFoodTrucks - 5); // Placeholder calculation

            var statistics = new AdminStatisticsDto
            {
                TotalUsers = totalUsers,
                TotalVendors = totalVendors,
                TotalFoodTrucks = totalFoodTrucks,
                ActiveFoodTrucks = activeFoodTrucks,
                TotalReviews = totalReviews,
                AverageRating = Math.Round(averageRating, 1),
                NewUsersThisMonth = newUsersThisMonth,
                NewFoodTrucksThisMonth = newFoodTrucksThisMonth
            };

            return new ApiResponse<AdminStatisticsDto>
            {
                Success = true,
                Data = statistics
            };
        }

        public async Task<ApiResponse<UserAnalyticsDto>> GetUserAnalyticsAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var adminUsers = await _context.Users.CountAsync(u => u.Role == "admin");
            var vendorUsers = await _context.Users.CountAsync(u => u.Role == "vendor");
            var regularUsers = await _context.Users.CountAsync(u => u.Role == "appuser");

            var analytics = new UserAnalyticsDto
            {
                TotalUsers = totalUsers,
                AdminUsers = adminUsers,
                VendorUsers = vendorUsers,
                RegularUsers = regularUsers
            };

            return new ApiResponse<UserAnalyticsDto>
            {
                Success = true,
                Data = analytics
            };
        }

        public async Task<ApiResponse<FoodTruckAnalyticsDto>> GetFoodTruckAnalyticsAsync()
        {
            var totalFoodTrucks = await _context.FoodTrucks.CountAsync();
            var activeFoodTrucks = await _context.FoodTrucks.CountAsync(f => f.IsActive);
            var inactiveFoodTrucks = totalFoodTrucks - activeFoodTrucks;

            var topRated = await _context.FoodTrucks
                .Where(f => f.TotalReviews > 0)
                .OrderByDescending(f => f.AverageRating)
                .Take(10)
                .Select(f => new TopRatedFoodTruck
                {
                    FoodTruckId = f.FoodTruckId,
                    Name = f.Name,
                    AverageRating = f.AverageRating,
                    TotalReviews = f.TotalReviews
                })
                .ToListAsync();

            var analytics = new FoodTruckAnalyticsDto
            {
                TotalFoodTrucks = totalFoodTrucks,
                ActiveFoodTrucks = activeFoodTrucks,
                InactiveFoodTrucks = inactiveFoodTrucks,
                TopRatedFoodTrucks = topRated
            };

            return new ApiResponse<FoodTruckAnalyticsDto>
            {
                Success = true,
                Data = analytics
            };
        }

        public async Task<PaginatedResponse<AdminLogDto>> GetSystemLogsAsync(int pageNumber, int pageSize, string? level, DateTime? from, DateTime? to)
        {
            await Task.CompletedTask;
            return new PaginatedResponse<AdminLogDto>
            {
                Items = new List<AdminLogDto>(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalItems = 0,
                TotalPages = 0
            };
        }

        private bool IsValidRole(string role)
        {
            return role == "admin" || role == "vendor" || role == "appuser";
        }
    }
}