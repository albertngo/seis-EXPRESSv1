let http = require("http");
let app = require("./app");

let server = http.createServer(app);
let port = 3000;
server.listen(port);
console.log(`Listening on ${port}..........`);
