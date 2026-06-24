using backend.Models;

namespace backend.DTOs
{
    public static class SessionUserMapper
    {
        public static SessionUserDto ToSessionUserDto(this SessionUser user)
        {
            return new SessionUserDto { Id = user.Id, UserName = user.Username };
        }

        public static SessionUserDto ToSessionUserDto(this RuntimeSessionUser user)
        {
            return new SessionUserDto { Id = user.Id, UserName = user.Username };
        }
    }
}
