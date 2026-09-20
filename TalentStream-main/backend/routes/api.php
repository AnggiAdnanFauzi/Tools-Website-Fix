<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\RequisitionController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\StageController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\PaymentController;

// ==========================================
// PUBLIC ROUTES
// ==========================================
Route::get('/seed', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
        return response()->json([
            'status' => 'success',
            'message' => 'Database seeders executed successfully! Demo accounts & data are now available.',
            'output' => \Illuminate\Support\Facades\Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});
Route::post("/register", [AuthController::class, "register"]);
Route::post("/login", [AuthController::class, "login"]);

// Public routes for candidate application & job view (Career Site)
Route::get("/jobs", [JobController::class, "index"]);
Route::get("/jobs/{id}", [JobController::class, "show"]);
Route::post("/applications", [ApplicationController::class, "store"]); // Public application form submit
Route::post("/upload", [UploadController::class, "uploadFile"]);
Route::get("/feedbacks", [FeedbackController::class, "index"]);
Route::post("/feedbacks", [FeedbackController::class, "store"]); // Cloudinary upload (CV, PDF, Avatar)

// Midtrans Payment & Billing Routes (Webhooks & Tokens)
Route::post("/payment/snap-token", [PaymentController::class, "createSnapToken"]);
Route::post("/payment/notification", [PaymentController::class, "handleNotification"]);
Route::post("/payment/simulate-success", [PaymentController::class, "simulatePaymentSuccess"]);

// ==========================================
// PROTECTED ROUTES (Require Authentication)
// ==========================================
Route::middleware("auth:sanctum")->group(function () {
    
    // Auth & Profile
    Route::get("/user", [AuthController::class, "me"]);
    Route::post("/logout", [AuthController::class, "logout"]);
    Route::post("/profile", [AuthController::class, "updateProfile"]);

    // Super Admin actions
    Route::get("/admin/users", [AuthController::class, "listUsers"]);
    Route::put("/admin/users/{id}", [AuthController::class, "updateUser"]);
    Route::delete("/admin/users/{id}", [AuthController::class, "deleteUser"]); // Soft delete / archive
    Route::post("/admin/users/{id}/restore", [AuthController::class, "restoreUser"]); // Restore archived user

    // Pipeline & Data endpoints
    Route::get("/stages", [StageController::class, "index"]);
    Route::get("/projects", [ProjectController::class, "index"]);
    Route::get("/candidates", [CandidateController::class, "index"]);
    Route::get("/applications", [ApplicationController::class, "index"]); // Get all applications
    Route::get("/interviews", [InterviewController::class, "index"]);
    Route::get("/requisitions", [RequisitionController::class, "index"]);
    Route::get("/tasks", [TaskController::class, "index"]);
    Route::get("/analytics", [AnalyticsController::class, "index"]);
    Route::get("/payment/transactions", [PaymentController::class, "getTransactions"]);

    // Recruiter actions (CRUD)
    Route::post("/jobs", [JobController::class, "store"]);
    Route::put("/jobs/{id}", [JobController::class, "update"]);
    Route::delete("/jobs/{id}", [JobController::class, "destroy"]);

    Route::put("/applications/{id}", [ApplicationController::class, "update"]);
    Route::delete("/applications/{id}", [ApplicationController::class, "destroy"]);

    Route::post("/candidates", [CandidateController::class, "store"]);
    Route::put("/candidates/{id}", [CandidateController::class, "update"]);

    Route::post("/interviews", [InterviewController::class, "store"]);
    Route::put("/interviews/{id}", [InterviewController::class, "update"]);

    Route::post("/requisitions", [RequisitionController::class, "store"]);
    Route::put("/requisitions/{id}", [RequisitionController::class, "update"]);

    Route::post("/projects", [ProjectController::class, "store"]);
    Route::put("/projects/{id}", [ProjectController::class, "update"]);

    Route::post("/tasks", [TaskController::class, "store"]);
    Route::put("/tasks/{id}", [TaskController::class, "update"]);
    Route::delete("/tasks/{id}", [TaskController::class, "destroy"]);
});
