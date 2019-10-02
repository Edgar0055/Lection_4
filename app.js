const $http = require('http');
const $url = require('url');
const $fs = require('fs');
const $path = require('path');
const $pug = require('pug');

$http.createServer((req, res) => {
    const { URL } = $url;
    const { headers: { host }, method, url } = req;
    const uri = new URL(`http://${host}${url}`);
    if (method === 'GET' && uri.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const fieldName = uri.searchParams.get('fieldName') || 'fieldName';
        // const enctype = 'multipart/form-data';
        const enctype = 'application/x-www-form-urlencoded';
        // const enctype = 'text/plain';
        const html = $pug.renderFile('form.pug', { enctype, fieldName });
        res.end(html);        
    } else if (method === 'POST' && uri.pathname === '/') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        }).on('end', () => {
            const parse = (data) => data.split('&')
                .map(_ => _.split('=', 2))
                .map(([key, value]) => ({ [decodeURIComponent(key)]: decodeURIComponent(value) }))
                .reduce((__, _) => Object.assign(__, _), {});
            const query = parse(data);
            const [[fieldName, fieldValue]] = [...Object.entries(query)];
            res.writeHead(200, { 'Content-Type': 'text/html' });
            const html = $pug.renderFile('result.pug', { fieldName, fieldValue });
            res.end(html);    
        }).on('error', () => {
            res.writeHead(403, { });
            res.end();
        });
    } else {
        res.writeHead(404, { });
        res.end();
    }
}).listen(4000);
