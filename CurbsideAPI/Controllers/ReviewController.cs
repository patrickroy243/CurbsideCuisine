using AutoMapper;
using CurbsideAPI.DTOs;
using CurbsideAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CurbsideAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;
    private readonly IMapper _mapper;

    public ReviewController(IReviewService reviewService, IMapper mapper)
    {
        _reviewService = reviewService;
        _mapper = mapper;
    }

    [HttpGet("foodtruck/{foodTruckId}")]
    public async Task<ActionResult<ApiResponse<List<ReviewResponseDto>>>> GetReviewsByFoodTruck(int foodTruckId)
    {
        var result = await _reviewService.GetReviewsByFoodTruckIdAsync(foodTruckId);
        return Ok(result);
    }

    [HttpGet("foodtruck/{foodTruckId}/all")]
    public async Task<ActionResult<List<ReviewResponseDto>>> GetAllReviewsForFoodTruck(int foodTruckId)
    {
        var result = await _reviewService.GetAllAsync(foodTruckId);
        return Ok(result);
    }

    [HttpPost("foodtruck/{foodTruckId}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<ReviewResponseDto>>> CreateReview(int foodTruckId, ReviewCreateDto createReviewDto)
    {
        var result = await _reviewService.CreateAsync(foodTruckId, createReviewDto);
        return CreatedAtAction(nameof(GetReviewsByFoodTruck), new { foodTruckId = foodTruckId }, result);
    }

    [HttpPut("foodtruck/{foodTruckId}/{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<ReviewResponseDto>>> UpdateReview(int foodTruckId, int id, ReviewUpdateDto updateReviewDto)
    {
        var result = await _reviewService.UpdateAsync(foodTruckId, id, updateReviewDto);
        return Ok(result);
    }

    [HttpDelete("foodtruck/{foodTruckId}/{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteReview(int foodTruckId, int id)
    {
        var result = await _reviewService.DeleteAsync(foodTruckId, id);
        return Ok(result);
    }
}