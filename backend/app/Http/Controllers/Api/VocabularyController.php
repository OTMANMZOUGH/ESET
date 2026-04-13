<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\SrsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VocabularyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $vocabulary = $request->user()
            ->vocabulary()
            ->with('sourceBook:id,title')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return ApiResponse::success($vocabulary);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'word' => 'required|string|max:255',
            'translation' => 'required|string|max:255',
            'source_book_id' => 'nullable|exists:books,id',
        ]);

        $vocabulary = SrsService::addWord(
            $request->user()->id,
            $validated['word'],
            $validated['translation'],
            $validated['source_book_id'] ?? null
        );

        return ApiResponse::success($vocabulary, 'Word added to vocabulary', 201);
    }

    public function due(Request $request): JsonResponse
    {
        $limit = $request->query('limit', 20);
        $dueWords = SrsService::getDueVocabulary($request->user()->id, $limit);

        return ApiResponse::success($dueWords);
    }

    public function review(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'correct' => 'required|boolean',
        ]);

        $vocabulary = $request->user()->vocabulary()->findOrFail($id);
        $updated = SrsService::processReview($vocabulary, $validated['correct']);

        return ApiResponse::success([
            'vocabulary' => $updated,
            'nextReview' => $updated->next_review_at,
            'masteryLevel' => $updated->mastery_level,
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $stats = SrsService::getUserStats($request->user()->id);
        return ApiResponse::success($stats);
    }
}
