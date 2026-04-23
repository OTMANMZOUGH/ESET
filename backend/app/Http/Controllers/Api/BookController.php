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

        $word = $validated['word'];
        
        try {
            // Using MyMemory API (free, no key required for up to 500 requests/day)
            $response = \Illuminate\Support\Facades\Http::get('https://api.mymemory.translated.net/get', [
                'q' => $word,
                'langpair' => 'es|en'
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $translation = $data['responseData']['translatedText'] ?? 'Translation not found';
                
                return ApiResponse::success([
                    'word' => $word,
                    'translation' => $translation,
                    'bookId' => $id,
                ]);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Translation API error: ' . $e->getMessage());
        }

        // Fallback if API fails
        return ApiResponse::success([
            'word' => $word,
            'translation' => '[Could not translate: ' . $word . ']',
            'bookId' => $id,
        ]);
    }
}
