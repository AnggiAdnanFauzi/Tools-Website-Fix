<?php
// Fix Permissions Script - DELETE AFTER USE!
$root = dirname(__DIR__); // Goes up from public to Laravel root
$errors = [];
$fixed = 0;

// Fix directories to 755
$dirs = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

foreach ($dirs as $item) {
    if ($item->isDir()) {
        if (!chmod($item->getPathname(), 0755)) {
            $errors[] = "Dir failed: " . $item->getPathname();
        } else {
            $fixed++;
        }
    } elseif ($item->isFile()) {
        if (!chmod($item->getPathname(), 0644)) {
            $errors[] = "File failed: " . $item->getPathname();
        } else {
            $fixed++;
        }
    }
}

// Special: storage and bootstrap/cache need 775
$writeable = [
    $root . '/storage',
    $root . '/storage/app',
    $root . '/storage/app/public',
    $root . '/storage/framework',
    $root . '/storage/framework/cache',
    $root . '/storage/framework/sessions',
    $root . '/storage/framework/views',
    $root . '/storage/logs',
    $root . '/bootstrap/cache',
];

foreach ($writeable as $path) {
    if (is_dir($path)) {
        chmod($path, 0775);
    }
}

echo "<h2>Fix Permissions Result</h2>";
echo "<p>Fixed: <strong>{$fixed}</strong> items</p>";
if (!empty($errors)) {
    echo "<p>Errors (" . count($errors) . "):</p><ul>";
    foreach (array_slice($errors, 0, 20) as $e) {
        echo "<li>{$e}</li>";
    }
    echo "</ul>";
} else {
    echo "<p style='color:green'><strong>All permissions fixed successfully! Delete this file now.</strong></p>";
}
echo "<p>Root path: {$root}</p>";
?>
