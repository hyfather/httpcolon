import { useState } from 'react';

export default async function handler(req, res) {
    const val = req.query["url"];
    console.log("req url: " + val);

    const d1 = new Date().getTime();
    const response = await fetch(val);
    const data = await response;
    const d2 = new Date().getTime() - d1;

    let headers = {}
    for (var pair of data.headers.entries()) {
        console.log(pair[0]+ ': '+ pair[1]);
        headers[pair[0]] = pair[1];
    }

    res.status(200).json({ name: 'John Doe', latency: d2, status: response.status + " " + response.statusText, headers: headers });

}
