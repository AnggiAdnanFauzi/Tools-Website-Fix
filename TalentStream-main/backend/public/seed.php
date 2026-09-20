<?php
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->call('db:seed', ['--force' => true]);
echo 'Database seeded successfully from seed.php! Demo accounts are ready.';
