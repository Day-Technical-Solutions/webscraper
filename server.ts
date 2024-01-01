/** @format */
import querystring from "querystring";
import https from "https";
import QuickServer from "./QuickServer";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = new QuickServer();
const authTokens = {
	REDDIT: {
		token: null,
		expiration: "",
		requestTime: 0,
	},
};
app.onGET("/", (req, res) => {
	res.writeHead(200, { "Content-type": "text/html" });
	res.write("Connected! Successfully got /");
	res.end();
});
app.onGET("/api/get_access_token_client_credentials", async (req, res) => {
	if (
		authTokens.REDDIT.token &&
		authTokens.REDDIT.requestTime + parseInt(authTokens.REDDIT.expiration) > Date.now()
	) {
		console.log("Access already granted");
		res.writeHead(200, { "Content-type": "text/html" });
		res.write("Access already granted");
		return res.end();
	}
	const postData = querystring.stringify({
		grant_type: "client_credentials",
	});

	const headers = {
		"User-Agent": "AutoPollClient/v1 by u/McBizkit",
		"Content-Type": "application/x-www-form-urlencoded",
		"Content-Length": Buffer.byteLength(postData),
	};

	const options = {
		method: "POST",
		auth: `${process.env.REDDIT_ID}:${process.env.REDDIT_SECRET}`,
		headers,
	};

	const request = https.request(
		"https://www.reddit.com/api/v1/access_token",
		options,
		(response) => {
			let data = "";

			response.on("data", (chunk) => {
				data += chunk;
			});

			response.on("end", () => {
				const { access_token, token_type, expires_in, scope, refresh_token } = JSON.parse(data);
				authTokens.REDDIT.requestTime = Date.now();
				authTokens.REDDIT.token = access_token;
				authTokens.REDDIT.expiration = expires_in;
				if (!access_token) throw Error("response undefined");
				console.log("Successfully retrieved Token: ", authTokens.REDDIT.token);
				console.log("Expires in: ", authTokens.REDDIT.expiration);
				console.log({ token_type, scope, refresh_token });
			});
		}
	);

	request.on("error", (e) => {
		console.error(`Error fetching access token: ${e.message}`);
	});

	request.write(postData);
	request.end();

	res.writeHead(200, { "Content-type": "text/html" });
	res.write("Reddit Auth Successful");
});

app.onGET("/api/get_access_token_user", async (req, res) => {
	if (
		authTokens.REDDIT.token &&
		authTokens.REDDIT.requestTime + parseInt(authTokens.REDDIT.expiration) > Date.now()
	) {
		console.log("Access already granted");
		res.writeHead(200, { "Content-type": "text/html" });
		res.write("Access already granted");
		return res.end();
	}
	const postData = querystring.stringify({
		grant_type: "password",
		username: process.env.REDDIT_USERNAME,
		password: process.env.REDDIT_PASSWORD,
	});

	const headers = {
		"User-Agent": `AutoPollClient/v1 by u/${process.env.REDDIT_USERNAME}`,
	};

	const options = {
		method: "POST",
		auth: `${process.env.REDDIT_ID}:${process.env.REDDIT_SECRET}`,
		headers,
	};

	const request = https.request(
		"https://www.reddit.com/api/v1/access_token",
		options,
		(response) => {
			let data = "";

			response.on("data", (chunk) => {
				data += chunk;
			});

			response.on("end", () => {
				const { access_token, token_type, expires_in, scope, refresh_token } = JSON.parse(data);
				authTokens.REDDIT.requestTime = Date.now();
				authTokens.REDDIT.token = access_token;
				authTokens.REDDIT.expiration = expires_in;
				if (!access_token) throw Error("response undefined");
				console.log("Successfully retrieved Token: ", authTokens.REDDIT.token);
				console.log("Expires in: ", authTokens.REDDIT.expiration);
				console.log({ token_type, scope, refresh_token });
			});
		}
	);

	request.on("error", (e) => {
		console.error(`Error fetching access token: ${e.message}`);
	});

	request.write(postData);
	request.end();

	res.writeHead(200, { "Content-type": "text/html" });
	res.write("Reddit User Auth Successful");
});

app.onGET("/api/test_access_token", async (req, res) => {
	if (!authTokens.REDDIT.token) throw Error("No Access Token");
	res.writeHead(200, { "Content-type": "text/html" });
	const redditFetch = await axios
		.get("https://oauth.reddit.com/api/v1/me", {
			headers: {
				"User-Agent": "AutoPollClient/v1 by u/McBizkit",
				Authorization: `bearer ${authTokens.REDDIT.token}`,
			},
		})
		.then((response) => {
			console.log(response.data);
			res.write(JSON.stringify(response.data));
		})
		.catch((error) => {
			throw Error(`Error fetching data: ${error.message}`);
		});

	res.end();
});

app.onGET("/api/get_subreddit_posts", async (req, res) => {
	if (!authTokens.REDDIT.token) throw Error("No Access Token");
	res.writeHead(200, { "Content-type": "application/json" });
	const redditFetch = await axios
		.get("https://oauth.reddit.com/r/popular/hot", {
			headers: {
				"User-Agent": "AutoPollClient/v1 by u/McBizkit",
				Authorization: `bearer ${authTokens.REDDIT.token}`,
			},
		})
		.then((response) => {
			console.log(response.data.data.children);
			res.write(JSON.stringify(response.data.data));
		})
		.catch((error) => {
			throw Error(`Error fetching data: ${error.message}`);
		});

	res.end();
});

app.start(8080);
