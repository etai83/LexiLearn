// JavaScript Example: Reading Entities
// Filterable fields: title, content, file_url, word_count, reading_level
async function fetchDocumentEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/686b75162d5c916446217b35/entities/Document`, {
        headers: {
            'api_key': '6a50c6c4d69e4f55bcae319f64e0e7cb', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: title, content, file_url, word_count, reading_level
async function updateDocumentEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/686b75162d5c916446217b35/entities/Document/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '6a50c6c4d69e4f55bcae319f64e0e7cb', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}