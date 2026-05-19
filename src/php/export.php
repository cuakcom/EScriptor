<?php
header('Content-Type: application/octet-stream');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['format'], $input['filename'])) {
    http_response_code(400);
    exit('Invalid request');
}

$format = $input['format'];
$filename = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $input['filename']);
$metadata = $input['metadata'] ?? [];
$editorText = $input['editorText'] ?? '';

switch ($format) {
    case 'txt':
        header('Content-Disposition: attachment; filename="' . $filename . '.txt"');
        $content = "TÍTULO: " . ($metadata['title'] ?? '') . "\n";
        $content .= "AUTOR: " . ($metadata['author'] ?? '') . "\n";
        $content .= str_repeat("=", 50) . "\n\n";
        $content .= $editorText;
        echo $content;
        break;

    case 'docx':
        header('Content-Disposition: attachment; filename="' . $filename . '.docx"');
        echo createDOCX($metadata, $editorText);
        break;

    case 'fdx':
        header('Content-Disposition: attachment; filename="' . $filename . '.fdx"');
        echo createFDX($metadata, $editorText);
        break;

    default:
        http_response_code(400);
        exit('Invalid format');
}

function createDOCX($metadata, $content) {
    $zip = new ZipArchive();
    $temp = tempnam(sys_get_temp_dir(), 'docx_');

    if ($zip->open($temp, ZipArchive::CREATE) !== true) {
        return '';
    }

    $xml = '<?xml version="1.0" encoding="UTF-8"?>'
        . '<document xmlns="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        . '<body>';

    $xml .= '<p><r><t>' . htmlspecialchars($metadata['title'] ?? '') . '</t></r></p>';
    $xml .= '<p><r><t>' . htmlspecialchars($metadata['author'] ?? '') . '</t></r></p>';

    foreach (explode("\n", $content) as $line) {
        $xml .= '<p><r><t>' . htmlspecialchars($line) . '</t></r></p>';
    }

    $xml .= '</body></document>';

    $zip->addFromString('word/document.xml', $xml);
    $zip->addFromString('[Content_Types].xml', getContentTypes());
    $zip->addFromString('word/_rels/document.xml.rels', getDocumentRels());
    $zip->addFromString('_rels/.rels', getRels());

    $zip->close();

    $file_content = file_get_contents($temp);
    unlink($temp);

    return $file_content;
}

function createFDX($metadata, $content) {
    $fdx = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $fdx .= '<!DOCTYPE Document SYSTEM "http://www.finaldraft.com/dtd/screenplay.dtd">' . "\n";
    $fdx .= '<Document Type="Screenplay">' . "\n";
    $fdx .= '<ScriptData Title="' . htmlspecialchars($metadata['title'] ?? '') . '" />' . "\n";
    $fdx .= '<Content>' . "\n";

    foreach (explode("\n", $content) as $line) {
        if (trim($line)) {
            $fdx .= '<Paragraph Type="Action"><Text>' . htmlspecialchars($line) . '</Text></Paragraph>' . "\n";
        }
    }

    $fdx .= '</Content>' . "\n";
    $fdx .= '</Document>' . "\n";

    return $fdx;
}

function getContentTypes() {
    return '<?xml version="1.0" encoding="UTF-8"?>'
        . '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        . '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        . '<Default Extension="xml" ContentType="application/xml"/>'
        . '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
        . '</Types>';
}

function getDocumentRels() {
    return '<?xml version="1.0" encoding="UTF-8"?>'
        . '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>';
}

function getRels() {
    return '<?xml version="1.0" encoding="UTF-8"?>'
        . '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        . '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
        . '</Relationships>';
}
