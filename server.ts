/** @format */
import https from "https";
import QuickServer from "./QuickServer";

const app = new QuickServer();
app.onGET("/", (req, res) => {
	res.writeHead(200, { "Content-type": "text/html" });
	res.write("Connected! Successfully got /");
	res.end();
});
app.onGET("/api/get_reddit_access", async (req, res) => {
	const clientAuth = {
		username: process.env.REDDIT_ID,
		password: process.env.REDDIT_SECRET,
	};

	const postData = "";

	const headers = {
		"User-Agent": "AutoPollClient/v1 by u/McBizkit",
		"Content-Type": "application/x-www-form-urlencoded",
		"Content-Length": Buffer.byteLength(postData),
	};
});
app.start(8080);
