const http = require('http');
const path = require('path');
const fs = require('fs');

const hostname = 'localhost';
const port = 3000;
const publicFolder = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url} by method ${req.method}`);

    function notFound(message) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<html><body><h1>Error 404: ${message}</h1></body></html>`);
    }

    if (req.method !== 'GET') {
        notFound('Method not supported');
        return;
    }

    let fileUrl;
    try {
        fileUrl = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
        notFound('Invalid URL');
        return;
    }
    if (fileUrl === '/') fileUrl = '/index.html';

    const filePath = path.resolve(publicFolder, '.' + fileUrl);
    if (!filePath.startsWith(publicFolder + path.sep)) {
        notFound('Page not found');
        return;
    }
    if (path.extname(filePath) !== '.html') {
        notFound('Requested resource is not an HTML file');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            notFound('Page not found');
            return;
        }
        const stream = fs.createReadStream(filePath);
        stream.on('error', () => {
            if (!res.headersSent) notFound('Page not found');
            else res.destroy();
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        stream.pipe(res);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
