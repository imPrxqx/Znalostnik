namespace backend.GameModes
{
    /// <summary>
    /// Strucutre of activity assignemnt -- used for init new empty answers for users in session
    /// </summary>
    public class ActivityAssignment
    {
        /// <summary>
        /// Identifier of participant in session
        /// </summary>
        public Guid ParticipantId { get; set; }

        /// <summary>
        /// Identifier of activity in session
        /// </summary>
        public Guid ActivityId { get; set; }
    }
}
