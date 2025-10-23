using AutoMapper;
using CurbsideAPI.Models;
using CurbsideAPI.DTOs;

namespace CurbsideAPI.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserResponseDto>()
                .ForMember(dest => dest.Token, opt => opt.Ignore());
            CreateMap<UserRegisterDto, User>();
            CreateMap<UserUpdateDto, User>();

            CreateMap<FoodTruck, FoodTruckResponseDto>()
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Owner.UserName));
            CreateMap<FoodTruckCreateDto, FoodTruck>();
            CreateMap<FoodTruckUpdateDto, FoodTruck>();

            CreateMap<MenuItem, MenuItemResponseDto>()
                .ForMember(dest => dest.FoodTruckName, opt => opt.MapFrom(src => src.FoodTruck != null ? src.FoodTruck.Name : "Unknown"));
            CreateMap<MenuItemCreateDto, MenuItem>();
            CreateMap<MenuItemUpdateDto, MenuItem>();

            CreateMap<Review, ReviewResponseDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User != null ? src.User.UserName : "Anonymous"))
                .ForMember(dest => dest.FoodTruckName, opt => opt.MapFrom(src => src.FoodTruck != null ? src.FoodTruck.Name : "Unknown"));
            CreateMap<ReviewCreateDto, Review>();
            CreateMap<ReviewUpdateDto, Review>();
        }
    }
}