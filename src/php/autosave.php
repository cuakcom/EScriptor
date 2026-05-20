<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['filename'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

$filename = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $input['filename']);
$data = $input['data'];

$autosaveDir = __DIR__ . '/../../autosaves/';
if (!is_dir($autosaveDir)) {
    mkdir($autosaveDir, 0755, true);
}

$filepath = $autosaveDir . $filename . '.json';

if (file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    cleanOldAutosaves($autosaveDir);

    echo json_encode([
        'success' => true,
        'message' => 'Autoguardado correctamente',
        'filename' => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar']);
}

function cleanOldAutosaves($dir) {
    $files = array_diff(scandir($dir), ['.', '..']);
    if (count($files) > 5) {
        $files = array_map(function($f) use ($dir) {
            return ['name' => $f, 'time' => filemtime($dir . $f)];
        }, $files);

        usort($files, function($a, $b) {
            return $a['time'] - $b['time'];
        });

        for ($i = 0; $i < count($files) - 5; $i++) {
            unlink($dir . $files[$i]['name']);
        }
    }
}
