﻿using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text.Json;
using backend.Managers;
using Microsoft.AspNetCore.Identity;

namespace backend.Domain
{
    public class Room
    {
        public string RoomId { get; set; }
        public string Password { get; set; }
        public User HostUsername { get; set; }
        public DateTime LastActivity { get; set; }
        public JsonElement RoomStateHost { get; set; }
        public JsonElement RoomStateUsers { get; set; }
        public PlayerManager PlayerManager { get; set; }

        public Room(
            string roomId,
            string password,
            User user,
            JsonElement roomStateHost,
            JsonElement roomStateUsers
        )
        {
            RoomId = roomId;
            Password = password;
            HostUsername = user;
            RoomStateHost = roomStateHost;
            RoomStateUsers = roomStateUsers;
            LastActivity = DateTime.Now;
            PlayerManager = new PlayerManager();
        }
    }
}
