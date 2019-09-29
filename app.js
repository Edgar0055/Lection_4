const $http = require('http');
const $url = require('url');

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
        res.end(`
        <html>
            <body>
                <form action="/" method="post" enctype="${enctype}" >
                    <input type="text" name="${fieldName}" />
                    <input type="submit" value="send" />
                </form> 
            </body> 
        </html>`);        
    } else if (method === 'POST' && uri.pathname === '/') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        }).on('end', () => {
            const { query } = $url.parse(`?${data}`, true);
            const [[name, value]] = [...Object.entries(query)];
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
            <html>
                <body>
                    <h4>Result:</h4>
                    <div><span><b>Name</b>: ${name}</span><span><b>Value</b>: ${value}</span></div>
                </body> 
            </html>`);    
        }).on('error', () => {
            res.writeHead(403, { });
            res.end();
        });
    } else {
        res.writeHead(404, { });
        res.end();
    }
}).listen(4000);
