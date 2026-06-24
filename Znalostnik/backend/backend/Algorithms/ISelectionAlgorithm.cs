using System.Text.Json;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Algorithms
{
    public interface ISelectionAlgorithm
    {
        string AlgorithmType { get; }

        RuntimeActivity SelectNextQuestion(
            IReadOnlyList<RuntimeActivity> candidates,
            AlgorithmsState algorithmState
        );
        void UpdatePlayerState(
            AlgorithmsState algorithmState,
            RuntimeActivity activity,
            int correctPercentile
        );
    }
}
