/** @format */

import http from "http";

class QuickServer {
	private PORT = 8080;
	private SERVER = http;
	INSTANCE: http.Server | null = null;
	private ROUTES = {};
	public start(port: number = this.PORT) {
		this.PORT = port;
		this.INSTANCE = this.SERVER.createServer((req, res) => {
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PATCH, PUT, DELETE");
			res.setHeader("Access-Control-Max-Age", 2592000); // 30 days
			res.setHeader("Access-Control-Allow-Headers", "content-type");
			switch (req.method) {
				case "GET":
					if (!req.url || req.url === "") {
						res.statusCode = 500;
						res.write(`CANNOT GET UNDEFINED`);
						res.end();
					} else {
						if (!(req.url in this.ROUTES)) {
							res.statusCode = 404;
							res.write("404: Not Found");
							res.end();
						} else {
							try {
								this.ROUTES[req.url](req, res);
							} catch (err) {
								console.log(err);
								res.statusCode = 500;
								res.end();
							}
						}
					}
					break;
				case "POST":
					res.statusCode = 501;
					res.write("Not Implemented");
					res.end();
					break;

				case "DELETE":
					res.statusCode = 501;
					res.write("Not Implemented");
					res.end();
					break;

				case "PUT":
					res.statusCode = 501;
					res.write("Not Implemented");
					res.end();
					break;

				case "PATCH":
					res.statusCode = 501;
					res.write("Not Implemented");
					res.end();
					break;

				case "OPTIONS":
					res.statusCode = 501;
					res.write("Not Implemented");
					res.end();
					break;

				default:
					res.statusCode = 500;
					res.end("BAD REQUEST");
					break;
			}
		}).listen(this.PORT);
	}
	public onGET(
		route: string,
		callback: (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void
	) {
		if (route in this.ROUTES) throw Error("Route already defined");
		this.ROUTES[route] = callback;
	}
}

export default QuickServer;
