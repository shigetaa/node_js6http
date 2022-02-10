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

