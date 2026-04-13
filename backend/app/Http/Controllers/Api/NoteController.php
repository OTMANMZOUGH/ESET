<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notes = $request->user()
            ->notes()
            ->orderBy('updated_at', 'desc')
            ->paginate(20);

        return ApiResponse::success($notes);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $note = $request->user()->notes()->create($validated);

        return ApiResponse::success($note, 'Note created successfully', 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $note = $request->user()->notes()->findOrFail($id);
        return ApiResponse::success($note);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
        ]);

        $note = $request->user()->notes()->findOrFail($id);
        $note->update($validated);

        return ApiResponse::success($note, 'Note updated successfully');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $note = $request->user()->notes()->findOrFail($id);
        $note->delete();

        return ApiResponse::success(null, 'Note deleted successfully');
    }
}
