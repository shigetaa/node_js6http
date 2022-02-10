const routes = {
	"GET": {
		"/info": (req, res) => {
			res.writeHead(200, { "Content-Type": "text/plain" });
			res.end("Welcom to the Info Page");
		}
	},
	"POST": {}
};
exports.handle = (req, res) => {
	try {
		if (routes[req.method][req.url]) {
			routes[req.method][req.url](req, res);
		} else {
			res.writeHead(404, { "Content-Type": "text/html" });
			res.end("<h1>Not Found</h1>");
		}
	} catch (ex) {
		console.log("error: " + ex);
	}
};
exports.get = (url, action) => {
	routes["GET"][url] = action;
}
exports.post = (url, action) => {
	routes["POST"][url] = action;
}