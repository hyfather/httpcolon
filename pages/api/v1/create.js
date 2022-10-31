import { useState } from 'react';

export default async function handler(req, res) {
    const val = req.query["url"];
    const uniq = (Math.random() + 1).toString(36).substring(6);
    console.log("req url: ", val);
    console.log("uniq: ", uniq);
    const keyURL = process.env.UPSTASH_REDIS_REST_URL + "/set/" + uniq + "/";

    const d1 = new Date().getTime();
    const response = await fetch(val);
    const data = await response;
    const d2 = new Date().getTime() - d1;

    let headers = {}
    for (var pair of data.headers.entries()) {
        console.log(pair[0]+ ': '+ pair[1]);
        headers[pair[0]] = pair[1];
    }

    await fetch(keyURL, {
        headers: {
            Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN
        },
        body: JSON.stringify({
            id: uniq,
            destination: val,
            headers: headers,
            status: response.status,
            statusText: response.statusText,
            timestamp: d1,
        }),
        method: "POST",
    }).then(response => response.json())
        .then(data => console.log(data));

    res.status(200).json({ id: uniq, latency: d2, status: response.status + " " + response.statusText, headers: headers });
}
