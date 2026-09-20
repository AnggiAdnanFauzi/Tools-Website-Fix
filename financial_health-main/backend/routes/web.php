<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/fix-perms2', function () {
    $base = base_path();
    
    $queue = [$base];
    $fixedDirs = 0;
    $fixedFiles = 0;
    
    while (!empty($queue)) {
        $currentDir = array_shift($queue);
        
        // Force directory to be executable/readable so we can scan it
        @chmod($currentDir, 0755);
        $fixedDirs++;
        
        $items = @scandir($currentDir);
        if ($items === false) continue;
        
        foreach ($items as $item) {
            if ($item === '.' || $item === '..') continue;
            
            $path = $currentDir . '/' . $item;
            
            if (is_dir($path)) {
                // Add to queue to process later
                $queue[] = $path;
            } else {
                // It's a file, make it readable
                @chmod($path, 0644);
                $fixedFiles++;
            }
        }
    }
    
    return "SUCCESS! Fixed $fixedDirs folders and $fixedFiles files. You can delete this route now.";
});
