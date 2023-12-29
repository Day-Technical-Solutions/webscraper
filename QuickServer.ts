/** @format */

import http from "http";

class QuickServer {
	PORT = 8080;
	SERVER = http;
	INSTANCE: any = null;
	public start(port: number = this.PORT) {
		this.PORT = port;
		this.INSTANCE = this.SERVER.createServer((req, res) => {
			res.writeHead(200, { "Content-Type": "text/html" });
			res.write("Connected");
			res.end();
		}).listen(port);
	}
}

export default QuickServer;
