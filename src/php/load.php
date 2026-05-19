<?php
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$filename = $_GET['filename'] ?? '';

$saveDir = __DIR__ . '/../../scripts/';

switch ($action) {
    case 'list':
        listScripts($saveDir);
        break;

    case 'get':
        getScript($saveDir, $filename);
        break;

    case 'delete':
        deleteScript($saveDir, $filename);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}

function listScripts($saveDir) {
    if (!is_dir($saveDir)) {
        echo json_encode(['scripts' => []]);
        return;
    }

    $files = array_diff(scandir($saveDir), ['.', '..']);
    $scripts = [];

    foreach ($files as $file) {
        if (substr($file, -5) === '.json') {
            $data = json_decode(file_get_contents($saveDir . $file), true);
            if ($data) {
                $scripts[] = [
                    'filename' => $data['filename'],
                    'title' => $data['title'],
                    'author' => $data['author'],
                    'timestamp' => $data['timestamp']
                ];
            }
        }
    }

    echo json_encode(['scripts' => $scripts]);
}

function getScript($saveDir, $filename) {
    $filename = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $filename);
    $filepath = $saveDir . $filename . '.json';

    if (!file_exists($filepath)) {
        http_response_code(404);
        echo json_encode(['error' => 'Script not found']);
        return;
    }

    $data = json_decode(file_get_contents($filepath), true);
    echo json_encode($data);
}

function deleteScript($saveDir, $filename) {
    $filename = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $filename);
    $filepath = $saveDir . $filename . '.json';

    if (!file_exists($filepath)) {
        http_response_code(404);
        echo json_encode(['error' => 'Script not found']);
        return;
    }

    if (unlink($filepath)) {
        echo json_encode(['success' => true, 'message' => 'Script deleted']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting script']);
    }
}
