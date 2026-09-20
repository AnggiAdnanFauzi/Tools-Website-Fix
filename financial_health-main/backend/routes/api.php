<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DiagnosticController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\AdminController;

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Diagnostic history endpoints
    Route::post('/diagnostics', [DiagnosticController::class, 'store']);
    Route::get('/diagnostics', [DiagnosticController::class, 'index']);
    Route::delete('/diagnostics/clear', [DiagnosticController::class, 'clear']);

    // Avatar upload to Cloudinary CDN
    Route::post('/upload-avatar', [UploadController::class, 'uploadAvatar']);

    // Admin Panel endpoints
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users', [AdminController::class, 'createUser']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::post('/users/bulk-delete', [AdminController::class, 'bulkDeleteUsers']);
        Route::post('/users/bulk-role', [AdminController::class, 'bulkUpdateUserRole']);
        Route::get('/diagnostics', [AdminController::class, 'diagnostics']);
        Route::delete('/diagnostics/{id}', [AdminController::class, 'deleteDiagnostic']);
    });

    Route::get('/user', [AuthController::class, 'me']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
