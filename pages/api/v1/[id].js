
export default async function handler(req, res) {
    const id = req.query["id"];

    console.log("id: ", id);

    const keyURL = process.env.UPSTASH_REDIS_REST_URL + "/get/" + id + "/";

    console.log("keyurl: " + keyURL);
    const response = await fetch(keyURL, {
        headers: {
            Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN
        }
    })
    const fullData = await response.json();
    const data = await JSON.parse(fullData.result);


    res.status(200).json({ id: id, destination: data.destination, timestamp: data.timestamp, latency: data.latency, status: data.status + " " + data.statusText, headers: data.headers });
}
