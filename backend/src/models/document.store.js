const documents = new Map();

function getDocument(docid) {
    if (!documents.has(docId)) {
      documents.set(docId, { id: docId, content: "" });
    }
    return documents.get(docId);
}

function updateDocument(docId, content) {
  const doc = getDocument(docId);
  doc.content = content;
  return doc;
}

module.exports = {
  getDocument,
  updateDocument,
};