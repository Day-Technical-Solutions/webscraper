/** @format */
import https from "https";
import QuickServer from "./QuickServer";

const app = new QuickServer();
app.onGET("/", (req, res) => {
	res.writeHead(200, { "Content-type": "text/html" });
	res.write("Connected! Successfully got /");
	res.end();
});
app.onGET("/curl_reddit", async (req, res) => {
	https
		.get("https://www.reddit.com/", (redditResponse) => {
			let data = "";
			redditResponse.on("data", (chunk) => {
				data += chunk;
			});
			redditResponse.on("end", () => {
				res.writeHead(200, { "Content-type": "text/html" });
				res.end(data);
			});
		})
		.on("error", (error) => {
			res.writeHead(500);
			res.end(`Error fetching data: ${error.message}`);
		});
});
app.start(8080);
