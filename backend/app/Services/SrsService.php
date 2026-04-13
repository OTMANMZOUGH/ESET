<?php

namespace App\Services;

use App\Models\UserVocabulary;
use Carbon\Carbon;

class SrsService
{
    /**
     * SM-2 Algorithm for Spaced Repetition
     *
     * Mastery levels: 0-5
     * - 0: New word
     * - 1: 1 day
     * - 2: 3 days
     * - 3: 7 days
     * - 4: 14 days
     * - 5: 30 days (mastered)
     */

    private const INTERVALS = [
        0 => 0,      // New word - review immediately
        1 => 1,      // 1 day
        2 => 3,      // 3 days
        3 => 7,      // 7 days
        4 => 14,     // 14 days
        5 => 30,     // 30 days
    ];

    /**
     * Calculate next review date based on SM-2 algorithm
     */
    public static function calculateNextReview(int $currentLevel, bool $correct): array
    {
        if ($correct) {
            // Move to next level
            $newLevel = min($currentLevel + 1, 5);
        } else {
            // Reset to level 1 on failure
            $newLevel = 1;
        }

        $intervalDays = self::INTERVALS[$newLevel];
        $nextReviewAt = Carbon::now()->addDays($intervalDays);

        return [
            'mastery_level' => $newLevel,
            'next_review_at' => $nextReviewAt,
        ];
    }

    /**
     * Process a review response
     */
    public static function processReview(UserVocabulary $vocabulary, bool $correct): UserVocabulary
    {
        $result = self::calculateNextReview($vocabulary->mastery_level, $correct);

        $vocabulary->update([
            'mastery_level' => $result['mastery_level'],
            'next_review_at' => $result['next_review_at'],
        ]);

        return $vocabulary->fresh();
    }

    /**
     * Get due vocabulary items for a user
     */
    public static function getDueVocabulary(int $userId, int $limit = 20): \Illuminate\Database\Eloquent\Collection
    {
        return UserVocabulary::where('user_id', $userId)
            ->where(function ($query) {
                $query->whereNull('next_review_at')
                    ->orWhere('next_review_at', '<=', Carbon::now());
            })
            ->orderBy('next_review_at', 'asc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get statistics for a user's vocabulary progress
     */
    public static function getUserStats(int $userId): array
    {
        $vocabulary = UserVocabulary::where('user_id', $userId)->get();

        return [
            'total' => $vocabulary->count(),
            'new' => $vocabulary->where('mastery_level', 0)->count(),
            'learning' => $vocabulary->whereBetween('mastery_level', [1, 4])->count(),
            'mastered' => $vocabulary->where('mastery_level', 5)->count(),
            'due_today' => $vocabulary->where('next_review_at', '<=', Carbon::now())->count(),
        ];
    }

    /**
     * Add a new word to user's vocabulary
     */
    public static function addWord(int $userId, string $word, string $translation, ?int $sourceBookId = null): UserVocabulary
    {
        // Check if word already exists for this user
        $existing = UserVocabulary::where('user_id', $userId)
            ->where('word', $word)
            ->first();

        if ($existing) {
            return $existing;
        }

        // Create new vocabulary entry
        return UserVocabulary::create([
            'user_id' => $userId,
            'word' => $word,
            'translation' => $translation,
            'mastery_level' => 0,
            'next_review_at' => Carbon::now(), // Review immediately
            'source_book_id' => $sourceBookId,
        ]);
    }

    /**
     * Calculate streak (consecutive days of reviews)
     */
    public static function calculateStreak(int $userId): int
    {
        // This would require a separate reviews table to track daily activity
        // For now, return a placeholder
        return 0;
    }
}
