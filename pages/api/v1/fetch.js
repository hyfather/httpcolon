import { useState } from 'react';

export default async function handler(req, res) {
    const val = req.query["url"];
    console.log("req url: " + val);

    const response = await fetch(val);
    const data = await response;

    let resp = {}
    for (var pair of data.headers.entries()) {
        console.log(pair[0]+ ': '+ pair[1]);
        resp[pair[0]] = pair[1];
    }

    res.status(200).json({ name: 'John Doe', resp: resp });
}
