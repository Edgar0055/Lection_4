const $http = require( 'http' );
const $url = require( 'url' );

$http.createServer( ( req, res ) => {
    const url = $url.parse( req.url, true, );
    const method = req.method;
    if ( url.pathname === '/' && method === 'GET' ) {
        res.writeHead( 200, { 'Content-Type': 'text/html' } );
        const fieldName = url.query.fieldName || 'field';
        res.end( `
        <html>
            <body>
                <form action="/" method="post" >
                    <input type="text" name="${ fieldName }" />
                    <input type="submit" value="send" />
                </form> 
            </body> 
        </html>` );        
    } else if ( url.pathname === '/' && method === 'POST' ) {
        let data = '';
        req.on( 'data', ( chunk ) => {
            data += chunk;
        } );
        req.on( 'end', () => {
            res.writeHead( 200, { 'Content-Type': 'text/html' } );
            res.end( `
            Result:
            ${ data }
            ` );    
        } );
        req.on( 'error', () => {
            res.writeHead( 403, { } );
            res.end( );
        } );
    } else {
        res.writeHead( 404, { } );
        res.end( );
    }
} ).listen( 4000 );