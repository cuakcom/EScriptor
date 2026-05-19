<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['filename'], $input['content'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

$filename = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $input['filename']);
$content = $input['content'];
$metadata = $input['metadata'] ?? [];

$saveDir = __DIR__ . '/../../scripts/';
if (!is_dir($saveDir)) {
    mkdir($saveDir, 0755, true);
}

$filepath = $saveDir . $filename . '.json';

$data = [
    'filename' => $filename,
    'title' => $metadata['title'] ?? '',
    'author' => $metadata['author'] ?? '',
    'timestamp' => date('c'),
    'content' => $content,
    'editorText' => $input['editorText'] ?? ''
];

if (file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode([
        'success' => true,
        'message' => 'Guión guardado correctamente',
        'filename' => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar el archivo']);
}
