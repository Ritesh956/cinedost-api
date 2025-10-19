// This file is a compatibility shim for deployment platforms
// that expect a server.js in the root directory.
// It simply requires the compiled TypeScript output.

const path = require('path');
const distPath = path.join(__dirname, 'dist', 'server.js');

console.log('Loading server from:', distPath);
require(distPath);
