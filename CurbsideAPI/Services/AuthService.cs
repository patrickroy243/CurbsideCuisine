using AutoMapper;
using CurbsideAPI.Data;
using CurbsideAPI.DTOs;
using CurbsideAPI.Exceptions;
using CurbsideAPI.Interfaces;
using CurbsideAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CurbsideAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly CurbsideDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(CurbsideDbContext context, IJwtService jwtService, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _jwtService = jwtService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<User?> ValidateUserAsync(UserLoginDto loginDto)
        {
            if (string.IsNullOrEmpty(loginDto.Password))
                return null;

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || string.IsNullOrEmpty(user.Password))
                return null;

            if (!VerifyPassword(loginDto.Password, user.Password))
                return null;

            return user;
        }

        public async Task<ApiResponse<UserResponseDto>> RegisterAsync(UserRegisterDto registerDto)
        {
            
            if (string.IsNullOrEmpty(registerDto.Email) || string.IsNullOrEmpty(registerDto.Password))
                throw new ArgumentException("Email and password are required");

            
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                throw new ArgumentException("Email already registered");

            
            if (await _context.Users.AnyAsync(u => u.UserName == registerDto.UserName))
                throw new ArgumentException("Username already taken");

            var user = _mapper.Map<User>(registerDto);
            user.Password = HashPassword(registerDto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user);
            var responseDto = _mapper.Map<UserResponseDto>(user);
            responseDto.Token = token;

            return new ApiResponse<UserResponseDto>
            {
                Success = true,
                Data = responseDto,
                Message = "Registration successful"
            };
        }

        public async Task<ApiResponse<UserResponseDto>> LoginAsync(UserLoginDto loginDto)
        {
            var user = await ValidateUserAsync(loginDto);
            if (user == null)
                throw new UnauthorizedApiException("Invalid email or password");

            var token = _jwtService.GenerateToken(user);
            var responseDto = _mapper.Map<UserResponseDto>(user);
            responseDto.Token = token;

            return new ApiResponse<UserResponseDto>
            {
                Success = true,
                Data = responseDto,
                Message = "Login successful"
            };
        }

        public async Task<ApiResponse<bool>> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            if (string.IsNullOrEmpty(user.Password) || !VerifyPassword(currentPassword, user.Password))
                throw new UnauthorizedApiException("Current password is incorrect");

            if (string.IsNullOrEmpty(newPassword) || newPassword.Length < 6)
                throw new ArgumentException("New password must be at least 6 characters long");

            user.Password = HashPassword(newPassword);
            await _context.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Password changed successfully"
            };
        }

        public async Task<ApiResponse<UserResponseDto>> UpdateUserAsync(int userId, UserUpdateDto updateDto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            
            if (!string.IsNullOrEmpty(updateDto.Email) && updateDto.Email != user.Email)
            {
                if (await _context.Users.AnyAsync(u => u.Email == updateDto.Email && u.UserId != userId))
                    throw new ArgumentException("Email already in use");
                user.Email = updateDto.Email;
            }

            
            if (!string.IsNullOrEmpty(updateDto.UserName) && updateDto.UserName != user.UserName)
            {
                if (await _context.Users.AnyAsync(u => u.UserName == updateDto.UserName && u.UserId != userId))
                    throw new ArgumentException("Username already taken");
                user.UserName = updateDto.UserName;
            }

            
            // Update profile fields
            if (updateDto.Phone != null)
                user.Phone = updateDto.Phone;
                
            if (updateDto.Location != null)
                user.Location = updateDto.Location;
                
            if (updateDto.Bio != null)
                user.Bio = updateDto.Bio;

            if (updateDto.CurrentLatitude.HasValue)
                user.CurrentLatitude = updateDto.CurrentLatitude.Value;

            if (updateDto.CurrentLongitude.HasValue)
                user.CurrentLongitude = updateDto.CurrentLongitude.Value;

            if (updateDto.PreferredRadius.HasValue)
                user.PreferredRadius = updateDto.PreferredRadius.Value;

            await _context.SaveChangesAsync();

            var responseDto = _mapper.Map<UserResponseDto>(user);
            return new ApiResponse<UserResponseDto>
            {
                Success = true,
                Data = responseDto,
                Message = "Profile updated successfully"
            };
        }

        public async Task<ApiResponse<UserResponseDto>> GetUserProfileAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            var responseDto = _mapper.Map<UserResponseDto>(user);
            return new ApiResponse<UserResponseDto>
            {
                Success = true,
                Data = responseDto
            };
        }

        public async Task<ApiResponse<bool>> DeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "User account deleted successfully"
            };
        }

        public async Task<ApiResponse<bool>> UpdateUserLocationAsync(int userId, double latitude, double longitude)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            user.CurrentLatitude = latitude;
            user.CurrentLongitude = longitude;
            user.LastLocationUpdate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Location updated successfully"
            };
        }

        public async Task<ApiResponse<DashboardStatsDto>> GetDashboardStatsAsync()
        {
            var userId = GetCurrentUserId();

            var user = await _context.Users
                .Include(u => u.FavoriteFoodTrucks)
                    .ThenInclude(f => f.Owner)
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.FoodTruck)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                throw new KeyNotFoundException("User not found");

            var favoriteCount = user.FavoriteFoodTrucks.Count;
            var writtenReviewsCount = user.Reviews.Count;
            
            // For now, visits count will be the same as reviews count
            // In a real app, you might track actual visits separately
            var visitsCount = writtenReviewsCount;

            var recentFavorites = user.FavoriteFoodTrucks
                .OrderByDescending(f => f.CreatedAt)
                .Take(5)
                .ToList();

            var recentReviews = user.Reviews
                .OrderByDescending(r => r.CreatedAt)
                .Take(5)
                .ToList();

            var stats = new DashboardStatsDto
            {
                FavoriteCount = favoriteCount,
                WrittenReviewsCount = writtenReviewsCount,
                VisitsCount = visitsCount,
                RecentFavorites = _mapper.Map<List<FoodTruckResponseDto>>(recentFavorites),
                RecentReviews = _mapper.Map<List<ReviewResponseDto>>(recentReviews)
            };

            return new ApiResponse<DashboardStatsDto>
            {
                Success = true,
                Data = stats,
                Message = "Dashboard stats retrieved successfully"
            };
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                throw new UnauthorizedAccessException("User not authenticated");
            return userId;
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string? hashedPassword)
        {
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hashedPassword))
                return false;

            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}