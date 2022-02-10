const PORT = 3000;
const HTTP = require("http");
const FS = require("fs");

// URLを処理する関数
const getViewUrl = (url) => {
	return `views${url}.html`;
};

// サーバーを起動
HTTP.createServer((req, res) => {
	let viewUrl = getViewUrl(req.url);
	//
	FS.readFile(viewUrl, (err, data) => {
		if (err) {
			res.writeHead(404, {
				"Content-Type": "text/html"
			});
			res.write("<h1>Not Found</h1>");
		} else {
			res.writeHead(200, {
				"Content-Type": "text/html"
			});
			res.write(data);
		}
		res.end();
	});
}).listen(PORT);

console.log("server start http://localhost:%d/", PORT);