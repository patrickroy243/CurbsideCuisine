using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CurbsideAPI.DTOs;
using CurbsideAPI.Interfaces;

namespace CurbsideAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodTruckController : ControllerBase
    {
        private readonly IFoodTruckService _foodTruckService;

        public FoodTruckController(IFoodTruckService foodTruckService)
        {
            _foodTruckService = foodTruckService;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResponse<FoodTruckResponseDto>>> GetAll(
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 10)
        {
            var result = await _foodTruckService.GetAllAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("nearby")]
        public async Task<ActionResult<List<NearbyFoodTruckDto>>> GetNearby(
            [FromQuery] double latitude,
            [FromQuery] double longitude,
            [FromQuery] int radius = 5)
        {
            var result = await _foodTruckService.GetNearbyAsync(latitude, longitude, radius);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<FoodTruckResponseDto>>> GetById(int id)
        {
            var result = await _foodTruckService.GetByIdAsync(id);
            return Ok(result);
        }

        [Authorize(Roles = "admin,vendor")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<FoodTruckResponseDto>>> Create(FoodTruckCreateDto createDto)
        {
            var result = await _foodTruckService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = result.Data!.FoodTruckId }, result);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<FoodTruckResponseDto>>> Update(int id, FoodTruckUpdateDto updateDto)
        {
            var result = await _foodTruckService.UpdateAsync(id, updateDto);
            return Ok(result);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            var result = await _foodTruckService.DeleteAsync(id);
            return Ok(result);
        }

        [Authorize]
        [HttpPut("{id}/location")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateLocation(int id, [FromBody] UpdateLocationRequest request)
        {
            var result = await _foodTruckService.UpdateLocationAsync(id, request.Latitude, request.Longitude);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("test-auth")]
        public IActionResult TestAuth()
        {
            Console.WriteLine($"User authenticated: {User.Identity?.IsAuthenticated ?? false}");
            if (User.Identity?.IsAuthenticated == true)
            {
                Console.WriteLine($"User ID: {User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value}");
                Console.WriteLine($"User Role: {User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value}");
                Console.WriteLine($"User Name: {User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value}");
            }
            
            return Ok(new { 
                authenticated = User.Identity?.IsAuthenticated ?? false,
                userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value,
                role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value,
                name = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value
            });
        }

        [Authorize]
        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var result = await _foodTruckService.UpdateStatusAsync(id, request.IsOpen);
            return Ok(result);
        }

        [HttpPost("{id}/favorite")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> AddToFavorites(int id)
        {
            var result = await _foodTruckService.AddToFavoritesAsync(id);
            return Ok(result);
        }

        [HttpDelete("{id}/favorite")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> RemoveFromFavorites(int id)
        {
            var result = await _foodTruckService.RemoveFromFavoritesAsync(id);
            return Ok(result);
        }

        [HttpGet("favorites")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<List<FoodTruckResponseDto>>>> GetFavorites()
        {
            var result = await _foodTruckService.GetUserFavoritesAsync();
            return Ok(result);
        }

        [HttpGet("{id}/is-favorite")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> IsFavorite(int id)
        {
            var result = await _foodTruckService.IsFavoriteAsync(id);
            return Ok(result);
        }

        [HttpPost("upload-image")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> UploadImage(IFormFile image)
        {
            try
            {
                if (image == null || image.Length == 0)
                {
                    return BadRequest(new ApiResponse<string>
                    {
                        Success = false,
                        Message = "No image file provided"
                    });
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(image.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new ApiResponse<string>
                    {
                        Success = false,
                        Message = "Invalid file type. Allowed types: JPG, PNG, GIF, WebP"
                    });
                }

                if (image.Length > 15 * 1024 * 1024)
                {
                    return BadRequest(new ApiResponse<string>
                    {
                        Success = false,
                        Message = "File size exceeds 15MB limit"
                    });
                }

                var result = await _foodTruckService.UploadImageAsync(image);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>
                {
                    Success = false,
                    Message = "An error occurred while uploading the image: " + ex.Message
                });
            }
        }
    }

    public class UpdateLocationRequest
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class UpdateStatusRequest
    {
        public bool IsOpen { get; set; }
    }
}