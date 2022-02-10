const PORT = 3000;
const HTTP = require("http");
const FS = require("fs");

// リクエストされた名前のファイルを探す関数
const customReadFile = (file_path, res) => {
	if (FS.existsSync(file_path)) {
		FS.readFile(file_path, (err, data) => {
			if (err) {
				console.log(err);
				sendErrorResponse(res);
				return;
			}
			res.write(data);
			res.end();
		});
	} else {
		sendErrorResponse(res);
	}
}

// エラー処理関数
const sendErrorResponse = res => {
	res.writeHead(404, {
		"Content-Type": "text/html"
	});
	res.write("<h1>Not Found</h1>");
	res.end();
}

// サーバーを起動
HTTP.createServer((req, res) => {
	let url = req.url;
	// URL にファイル拡張子確認処理
	if (url.indexOf(".html") !== -1) {
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
		customReadFile(`./views${url}`, res);
	} else if (url.indexOf(".js") !== -1) {
		res.writeHead(200, {
			"Content-Type": "text/javascript"
		});
		customReadFile(`./public/js${url}`, res);
	} else if (url.indexOf(".css") !== -1) {
		res.writeHead(200, {
			"Content-Type": "text/css"
		});
		customReadFile(`./public/css${url}`, res);
	} else if (url.indexOf(".png") !== -1) {
		res.writeHead(200, {
			"Content-Type": "img/png"
		});
		customReadFile(`./public/img${url}`, res);
	} else {
		sendErrorResponse(res);
	}

}).listen(PORT);

console.log("server start http://localhost:%d/", PORT);