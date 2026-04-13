<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Book::query();

        if ($level = $request->query('level')) {
            $query->where('difficulty_level', $level);
        }

        $books = $query->select('id', 'title', 'author', 'difficulty_level', 'language')
            ->paginate(20);

        return ApiResponse::success($books);
    }

    public function show(int $id): JsonResponse
    {
        $book = Book::findOrFail($id);
        return ApiResponse::success($book);
    }

    public function translate(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'word' => 'required|string',
        ]);

        // In a real app, you'd call a translation API
        // For now, return a placeholder
        return ApiResponse::success([
            'word' => $validated['word'],
            'translation' => 'Translation: ' . $validated['word'],
            'bookId' => $id,
        ]);
    }
}
