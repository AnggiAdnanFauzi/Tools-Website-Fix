<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\User;

class UploadController extends Controller
{
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        $file = $request->file('image');
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        if (!$cloudName || !$apiKey || !$apiSecret) {
            return response()->json([
                'success' => false,
                'message' => 'Cloudinary credentials not configured on backend',
            ], 500);
        }

        $timestamp = time();
        $folder = 'financial_health_avatars';

        // Cloudinary signed upload: parameters in alphabetical order
        $paramsToSign = [
            'folder' => $folder,
            'timestamp' => $timestamp,
        ];
        ksort($paramsToSign);

        $paramString = '';
        foreach ($paramsToSign as $key => $value) {
            $paramString .= "{$key}={$value}&";
        }
        $paramString = rtrim($paramString, '&') . $apiSecret;
        $signature = sha1($paramString);

        try {
            $response = Http::attach(
                'file',
                file_get_contents($file->getRealPath()),
                $file->getClientOriginalName()
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
                'signature' => $signature,
                'folder' => $folder,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $secureUrl = $data['secure_url'] ?? $data['url'];

                // Auto-save to user profile in MySQL if authenticated or email provided
                $userId = auth('sanctum')->id();
                if (!$userId && $request->input('email')) {
                    $user = User::where('email', $request->input('email'))->first();
                    if ($user) {
                        $user->update(['avatar' => $secureUrl]);
                    }
                } else if ($userId) {
                    User::where('id', $userId)->update(['avatar' => $secureUrl]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Avatar successfully uploaded to Cloudinary CDN',
                    'url' => $secureUrl,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Cloudinary upload rejected',
                'details' => $response->json(),
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
