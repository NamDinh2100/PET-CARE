// Import the necessary modules
const hbs = require('hbs');

// Register a helper to limit the number of items in an array
hbs.registerHelper('limit', function(arr, limit) {
    if (!Array.isArray(arr)) { return []; }
    return arr.slice(0, limit);
});

// ...existing helpers and code...