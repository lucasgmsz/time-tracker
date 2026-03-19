namespace TimeTrackerAPI.Models
{
    public class ActivityRecord
    {
        public int Id { get; set; }
        public string Activity { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
