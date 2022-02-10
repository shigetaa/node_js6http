# Node.js で Webサーバーを作る
先日勉強した、[Node.js で Webサーバーを作る](https://github.com/shigetaa/node_js5http)続きで

今回は、HTMLファイル、Javascriptファイル、画像ファイル、CSSファイルなどのファイルをアセットを供給する方法を学びます。

この学習では次の事を学びます。
1. fs モジュールを利用してHTMLファイル全体を供給する
2. 静的なアセットを供給する
3. ルータモジュールを作成する

## fs モジュールでHTMLファイルを提供する
静的ファイルのHTMLを管理するフォルダーとして`views`と言うフォルダを作り
`views`フォルダの中にHTMLファイルを保存して管理します。
まずは、`views/index.html`ファイルを作成していきます。

```html
<!DOCTYPE html>
<html lang="ja">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Home Page</title>
</head>

<body>
	<h1>Welcome!</h1>
</body>

</html>
```

次にサーバプログラム`main.js`を作成していきます。

```javascript
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
```
以下のコマンドを実行してみます。

```bash
node main.js
```
```bash
server start http://localhost:3000/
```
Webブラウザーで`http://localhost:3000/index`にアクセスしてみてが`index.html`の内容が表示されると思います。

## アセットを供給する
アプリケーションの「アセット」は、クライアントサイドのビューで使われる画像やスタイルシードやJavaScriptです。
HTMLファイルと同様にアプリケーションで供給するには、それぞれに経路が必要です。
この処理を始めるには、すべてのアセットを置く為の`public`フォルダを作ります。
その`public`フォルダの中に`img` `css` `js` のフォルダを作成し、それぞれのアセットを配置します。

先ほど作成した、プログラム`main.js`に変更を加えて行きます。
エラー処理をする`sendErrorResponse`関数を追記します。
リクエストされた名前のファイルを探す`customReadFile`関数を追記します。
```javascript
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
```

以下のコマンドを実行してみます。

```bash
node main.js
```
```bash
server start http://localhost:3000/
```
Webブラウザーで`http://localhost:3000/index.html`にアクセスしてみてが`index.html`の内容が表示されると思います。

## 経路を別のファイルに移す
経路を`router.js`と言う新しいファイルに移し、経路を処理するモジュールとして作成していきます。

```javascript
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
```
`routes` オブジェクトは `handle` `get` `post` の関数を作成して、モジュール`exports`オブジェクトを通して、`main.js`のファイルからアクセスする事ができます。

実際に、`main.js`を変更して、`routes`モジュールを読み込みするように変更していきます。

```javascript
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
```
以下のコマンドを実行してみます。

```bash
node main.js
```
```bash
server start http://localhost:3000/
```
Webブラウザーで`http://localhost:3000/index.html`にアクセスしてみてが`index.html`の内容が表示されると思います。

最初に作成した`main.js`に比べて経路管理が簡単かつコードの記述量が少なくなりました。