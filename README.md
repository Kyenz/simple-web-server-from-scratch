# Project name: web server clone
# Purpose
    The project is for the sake of learning the fundamental working of a web server. In paricular, how a web server parse the HTTP request and return the HTTP response with the requested information (static files) to the user agent
# Assumption
1. Default file type to serve is text/html
2. The broswer request for a paricular type of file is already aware of which folder directory houses the file
    e.g: A user agent request for data.json file (which resides in ./data folder). The request is localhost:3000/data/data.json. The clone server does not automatically locate the folder 'data' and return data/data.json. A 404 page will be return as a result of omitting data/
# Overal process
1. Create an HTTP serever object using builtin http.createServer
2. Parse the URL sent along the request
   - Define the MIME type (Content-type header) of the requested file
   - If it is a html file, then permit truncation of the extention .html
   - If it is a homepage redirection request, then direct the browser to index.html
   - Otherwise, let it be ( no further processing for locating the folder of the requested file)
3. Config the path to the target file
4. Config the server response obeject (res) with serveFile function