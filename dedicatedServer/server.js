/**
 * Main documentation links:
 * (1) https://nodejs.org/dist/latest-v14.x/docs/api/http.html
 * (2) https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#anatomy-of-an-http-transaction
 * Main idea: your simple application in dedicatedSever folder has to support tow types od requests:
 *      - POST request to create a position (required fields - 'category', 'level', 'company', 'description')
 *      - GET request to get all positions
 *
 * Main TODOs:
 *      add logic to check certificate and key in 'certificates' folder. add this folder to ignored files
 *      add logic to use https instead of http in case there are certificate and key in 'certificates' folder
 *      add logic to handle request body
 *      add property for https server port 3001 to ./config.json
 *      follow other TODOs in the code
 */

const http = require('http');
const https = require('https');
const ports = require('./config.json');
const router = require('./router.js');
const fs = require('fs');



const options = (() => {
    try {
        return {
            cerf: fs.readFileSync('./cerf/server.crt','utf-8'),
            key: fs.readFileSync('./cerf/server.key','utf-8')
        }
        
    }catch (err) {
        return undefined
    }
})();

const isSecured = options && options.cerf && options.key

// TODO: Add check for certificate and use https in case you have self-signed certificate on server
// e.g. const server = <check for cert and key> ? https({cert and key}, requestHandler) : http(requestHandler)
// Documentation: https://nodejs.org/dist/latest-v14.x/docs/api/https.html#https_https_createserver_options_requestlistener
const server = isSecured? https.createServer(options, requestHandler) : http.createServer(options, requestHandler)

// TODO: Add check for certificate and use port 3001 in case you have self-signed certificate on server
// use config file to keep both port for http and port for https
// e.g. const port = <check for cert and key> ? <port for https from config> : <port for http from config>
const port = isSecured ? ports.https.port : ports.http.port

function requestHandler(request, response) {
    const {method, url} = request;
    const parsedUrl = new URL(url,"http://localhost:3000");
    const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g,'router');
    // TODO: add logic to handle request body data
    // See: https://nodejs.org/dist/latest-v14.x/docs/api/http.html
    if (method === 'GET') {
        
        const route = router[trimmedPath] ? router[trimmedPath][method.toLowerCase()] : undefined
        if(!route)  {
            response.statusCode = 404
            response.end('Error')
        } else {
            route(request, response).then(log).catch(log)    
          response.on('error', err => console.log(err))
        }
        
    }
    if (method === 'POST') {
        const buffer = [];
        request.setEncoding('utf8')

        request.on('data', chunk => {
            buffer.push(chunk)
        })

        request.on('end', () => {
        // TODO: add logic here to handle the end of emitting chunks of body data:
        //       add logic to find endpoint from ./router.js file using trimmedPath and method - router[trimmedPath][method.toLowerCase()]
        //       handle errors
            const content = JSON.parse(buffer.toString())
            const route = router[trimmedPath] ? router[trimmedPath][method.toLowerCase()] : undefined
        
            if(!route)  {
             response.statusCode = 404
             response.end('Error')
            } else {
                route(content, response).then(log).catch(log)    
                response.on('error', err => console.log(err))
            }
        });  
    }   

    // TODO: log all your requests method and url
    function log(message) {
        console.log(message);
    }
}

server.listen(port, () => {
    console.log(`I am listening to port ${port} on this computer`);
});