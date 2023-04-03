const http = require('http')
const fs = require('fs')
const fsPromise = require('fs/promises')
const path= require('path')
const {EventEmitter} = require('events')
const url = require('node:url')

const PORT = 3500;

async function serveFile(filePath, contentType, response){
    try{

        const rawData = await fsPromise.readFile(
            filePath, 
            contentType.includes('image') ? '' : 'utf8'
            );
        const data = (contentType === 'application/json') ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes("404.html") ? 404 : 200, 
            `Content-Type: ${contentType}`
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data        
        );
    }
    catch(e){
        console.log(e);
        response.statusCode = 500;
        response.end();
    }
}
// createServer (requestListener) -> an HTTP server object
// req: ImcomingMessage object
// res: OutcomingMessage object
const server = http.createServer((req, res) =>{
    let resourcePath = '/';
    let contentType;
    const extname = path.extname(req.url);

    console.log(req.method, req.url)
    // Set MIME type for the server response
    switch (extname){
        case '.js':{
            contentType = "text/javascript";
            break;
        }
        case '.css': {
            contentType = 'text/css';
            break;
        }
        case '.jpeg':{
            contentType = 'image/jpeg';
            break;
        }
        case '.png':{
            contentType = 'image/png';
            break;
        }
        case '.json':{
            contentType = 'application/json';
            break;
        }
        // consider text/html as default MIME type for HTTP request
        default:{
            contentType = 'text/html';
        }
    } 
    if(contentType !== 'text/html'){
        resourcePath = path.join(__dirname, req.url);         
    }
    else if(req.url === '/'){ // e.g: url = '/'
        resourcePath = path.join(__dirname, 'views', 'index.html');
    }
    else if(req.url.slice(-1) === '/'){ //e.g: url = 'index.html/'
        resourcePath = path.join(__dirname, 'views', req.url, 'index.html');
    }
    else{ // e.g: url = 'shoppingCart/payment/'
        resourcePath = path.join(__dirname, 'views', req.url);
    }
    if(!extname && req.url.slice(-1) !== '/'){
        resourcePath += '.html'
    }
    
    if(fs.existsSync(resourcePath)){
        // Serve the file
        serveFile(resourcePath, contentType, res);        
    }
    else{
        // Raise error to browser (404 File not found or 301 Redirection)
        if(path.parse(resourcePath).base === 'old-page.html'){
            serveFile(path.join(__dirname, 'views', 'new-page.html'), contentType, res);
        }
        else{ 
            serveFile(path.join(__dirname, 'views', '404.html'), contentType, res);
        }
    }
});


// Invokde the http server object to start listening for request
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});