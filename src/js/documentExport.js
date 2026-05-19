export function exportToDOCX() {
  const title = document.getElementById("coverTitle")?.value || "Guión";
  const author = document.getElementById("coverAuthor")?.value || "";
  const editorText = document.getElementById("editor")?.innerText || "";

  const docContent = `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
           xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="32"/>
        </w:rPr>
        <w:t>${escapeXml(title.toUpperCase())}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:t>Escrito por: ${escapeXml(author)}</w:t>
      </w:r>
    </w:p>
    <w:p/>
    ${editorText.split('\n').map(line => `
    <w:p>
      <w:r>
        <w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>
        <w:t>${escapeXml(line)}</w:t>
      </w:r>
    </w:p>`).join('')}
  </w:body>
</w:document>`;

  const docxBlob = createDOCXFile(docContent);
  downloadBlob(docxBlob, `${title}.docx`);
}

export function exportToFDX() {
  const title = document.getElementById("coverTitle")?.value || "Guión";
  const author = document.getElementById("coverAuthor")?.value || "";
  const editorText = document.getElementById("editor")?.innerText || "";

  const fdxContent = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<!DOCTYPE Document SYSTEM "http://www.finaldraft.com/dtd/screenplay.dtd">
<Document Type="Screenplay" Version="3">
  <ScriptData Title="${escapeXml(title)}" Author="${escapeXml(author)}" />
  <Content>
    ${editorText.split('\n').map(line => {
      if (!line.trim()) return '<Paragraph Type="Blank"><Text></Text></Paragraph>';
      return `<Paragraph Type="Action"><Text>${escapeXml(line)}</Text></Paragraph>`;
    }).join('\n')}
  </Content>
</Document>`;

  const fdxBlob = new Blob([fdxContent], { type: "application/xml" });
  downloadBlob(fdxBlob, `${title}.fdx`);
}

function createDOCXFile(docXml) {
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;

  const zip = new JSZip ? new JSZip() : createBasicZip();

  zip.file("[Content_Types].xml", contentTypes);
  zip.file("_rels/.rels", rels);
  zip.file("word/document.xml", docXml);
  zip.file("word/_rels/document.xml.rels", docRels);

  return zip.generateAsync ? zip.generateAsync({ type: "blob" }) : zip.generate({ type: "blob" });
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importFromFDX(file) {
  try {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/xml");

    if (doc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("Invalid FDX file");
    }

    const title = doc.querySelector("ScriptData")?.getAttribute("Title") || "";
    const author = doc.querySelector("ScriptData")?.getAttribute("Author") || "";
    const paragraphs = doc.querySelectorAll("Paragraph");

    let editorText = "";
    paragraphs.forEach(p => {
      const text = p.querySelector("Text")?.textContent || "";
      editorText += text + "\n";
    });

    return { title, author, editorText };
  } catch (error) {
    throw new Error("Error importing FDX: " + error.message);
  }
}

export async function importFromDOCX(file) {
  try {
    const zip = await JSZip.loadAsync(file);
    const docXml = await zip.file("word/document.xml").async("text");

    const parser = new DOMParser();
    const doc = parser.parseFromString(docXml, "text/xml");

    const paragraphs = doc.querySelectorAll("w\\:p, p");
    let editorText = "";

    paragraphs.forEach(p => {
      const texts = p.querySelectorAll("w\\:t, t");
      let lineText = "";
      texts.forEach(t => {
        lineText += t.textContent;
      });
      if (lineText) editorText += lineText + "\n";
    });

    return { title: "Importado", author: "", editorText };
  } catch (error) {
    throw new Error("Error importing DOCX: " + error.message);
  }
}
