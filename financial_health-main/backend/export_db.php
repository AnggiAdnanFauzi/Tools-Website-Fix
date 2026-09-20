<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$filename = __DIR__ . '/database_backup.sql';
$fp = fopen($filename, 'w');

if (!$fp) {
    die("Cannot open file for writing.");
}

fwrite($fp, "SET FOREIGN_KEY_CHECKS=0;\n");
fwrite($fp, "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n");
fwrite($fp, "SET AUTOCOMMIT = 0;\n");
fwrite($fp, "START TRANSACTION;\n");
fwrite($fp, "SET time_zone = '+00:00';\n\n");

$tables = DB::select('SHOW TABLES');
$dbName = env('DB_DATABASE');

foreach ($tables as $tableRow) {
    $table = json_decode(json_encode($tableRow), true);
    $tableName = array_values($table)[0];

    fwrite($fp, "-- Table structure for `$tableName`\n");
    fwrite($fp, "DROP TABLE IF EXISTS `$tableName`;\n");

    $createTable = DB::select("SHOW CREATE TABLE `$tableName`");
    $createTableStr = array_values(json_decode(json_encode($createTable[0]), true))[1];
    
    fwrite($fp, $createTableStr . ";\n\n");

    fwrite($fp, "-- Dumping data for table `$tableName`\n");
    $rows = DB::table($tableName)->get();
    
    foreach ($rows as $row) {
        $rowArray = (array) $row;
        $keys = array_keys($rowArray);
        $values = array_values($rowArray);
        
        $escapedValues = array_map(function($val) {
            if (is_null($val)) return 'NULL';
            $val = addslashes($val);
            $val = str_replace("\n", "\\n", $val);
            $val = str_replace("\r", "\\r", $val);
            return "'" . $val . "'";
        }, $values);

        $insertQuery = "INSERT INTO `$tableName` (`" . implode("`, `", $keys) . "`) VALUES (" . implode(", ", $escapedValues) . ");\n";
        fwrite($fp, $insertQuery);
    }
    fwrite($fp, "\n");
}

fwrite($fp, "COMMIT;\n");
fwrite($fp, "SET FOREIGN_KEY_CHECKS=1;\n");
fclose($fp);

echo "Database successfully exported to database_backup.sql\n";
