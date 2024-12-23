/**
 * Parses a header line and generates an ID.
 * @param {string} line - The header line.
 * @param {string} parentId - The parent ID for hierarchical IDs.
 * @returns {Object|null} - The parsed header and ID, or null if not a header.
 */
function parseHeader(line, parentId) {
    let id = parentId ? `${parentId}_` : '';
    if (line.startsWith('# ')) {
        id += line.replace('# ', '').toLowerCase().replace(/\s+/g, '_');
        return { header: line.replace('# ', ''), id: id };
    } else if (line.startsWith('## ')) {
        id += line.replace('## ', '').toLowerCase().replace(/\s+/g, '_');
        return { header: line.replace('## ', ''), id: id };
    } else {
        return null;
    }
}

/**
 * Caches metadata (IDs, section types, etc.) for faster warmhole navigation.
 * @param {string} md - The markdown content.
 * @returns {Object} - The cached metadata.
 */
function cacheMetadata(md) {
    const metadata = {};
    const lines = md.split('\n');
    let currentId = '';
    lines.forEach(line => {
        const header = parseHeader(line, currentId);
        if (header) {
            currentId = header.id;
            metadata[currentId] = { type: 'section', line: line };
        }
    });
    return metadata;
}

module.exports = cacheMetadata;
