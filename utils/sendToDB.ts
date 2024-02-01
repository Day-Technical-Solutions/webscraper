/** @format */

import axios from "axios";
import { RedditPost } from "../types";

export default async function sendToDB(postData: RedditPost) {
	const { selftext } = postData;

	if (selftext.length < 500) return new Error("Post is too short.");

	return await axios
		.post("http://127.0.0.1:8000/posts/create/", postData, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => {
			console.log(res);
			console.log("Successfully sent post to dbserver");
		})
		.catch((error) => console.log("Error sending post to DB: ", error));
}
