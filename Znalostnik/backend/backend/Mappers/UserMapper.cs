using backend.Models;

namespace backend.DTOs
{
    public static class UserMapper
    {
        public static UserDto ToUserDto(this User user)
        {
            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                UserType = user.UserType,
            };
        }
    }
}
