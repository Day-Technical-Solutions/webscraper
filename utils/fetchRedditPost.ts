/** @format */

import axios from "axios";
import { RedditPost } from "../types";

const getQuery = (subreddit: string, limit: number, listing: string, after: string) => {
	return (
		"https://oauth.reddit.com/r/" +
		subreddit +
		"/" +
		listing +
		"/?after=" +
		after +
		"&limit=" +
		limit
	);
};

export default async function fetchRedditPost(
	subreddit: string,
	token: string,
	after: string = ""
) {
	try {
		const response = await axios.get(getQuery(subreddit, 1, "hot", after), {
			headers: {
				"User-Agent": "AutoPollClient/v1 by u/McBizkit",
				Authorization: `bearer ${token}`,
			},
		});
		console.log(response.data.data.children);
		return response;
	} catch (error) {
		throw new Error(`Error fetching data: ${error.message}`);
	}
}
