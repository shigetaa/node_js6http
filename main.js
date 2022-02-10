const PORT = 3000;
const HTTP = require("http");
const FS = require("fs");
const ROUTE = require("./router");

// リクエストされた名前のファイルを探す関数
const customReadFile = (file, res) => {
	FS.readFile(file, (err, data) => {
		if (err) {
			console.log(err);
		}
		res.end(data);
	});
}
// 経路を登録する
ROUTE.get("/", (req, res) => {
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	res.end("<h1>INDEX</h1>");
});
ROUTE.get("/index.html", (req, res) => {
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	customReadFile(`./views/index.html`, res);
});
ROUTE.post("/", (req, res) => {
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	res.end("<h1>POSTED</h1>");
});

// サーバーを起動
HTTP.createServer(ROUTE.handle).listen(PORT);

console.log("server start http://localhost:%d/", PORT);