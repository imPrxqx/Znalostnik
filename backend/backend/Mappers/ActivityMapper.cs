using System.Text.Json;
using backend.Models;

namespace backend.DTOs
{
    public static class ActivityMapper
    {
        public static ActivityDTO ToActivityDto(this Activity activity)
        {
            return new ActivityDTO
            {
                Id = activity.Id,
                Type = activity.Type,
                Order = activity.Order,
                Style = JsonDocument.Parse(activity.Style),
                Content = JsonDocument.Parse(activity.Content),
                Solution = JsonDocument.Parse(activity.Solution),
            };
        }

        public static ActivityDTO ToActivityDto(this RuntimeActivity activity)
        {
            return new ActivityDTO
            {
                Id = activity.Id,
                Type = activity.Type,
                Order = activity.Order,
                Style = JsonDocument.Parse(activity.Style),
                Content = JsonDocument.Parse(activity.Content),
                Solution = JsonDocument.Parse(activity.Solution),
            };
        }

        public static ActivityDTO ToActivityWithoutSolutionDto(this RuntimeActivity activity)
        {
            return new ActivityDTO
            {
                Id = activity.Id,
                Type = activity.Type,
                Order = activity.Order,
                Style = JsonDocument.Parse(activity.Style),
                Content = JsonDocument.Parse(activity.Content),
            };
        }
    }
}
