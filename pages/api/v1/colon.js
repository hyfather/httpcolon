import path from "path";

const SCHEMA_VERSION = 0.1;
const MAX_INSTANCES = 10;
const fs = require('fs');
const util = require('util');
const crypto = require('crypto');


// const dirs = require('./cache-control');

export default async function handler(req, res) {
    const slug = req.query["slug"];
    const refresh = req.query["refresh"];

    console.log("slug: ", slug);
    // const slugs = slug[0].split(",");
    // let uniqSlug = slugs.join("_");
    // const url = "https://" + slugs.join("/");
    // console.log("uniqSlug: ", uniqSlug);

    if(slug == null) {
        res.status(200).json({ id: "Enter URL", destination: "Plz"});
        return;
    }

    const encodedSlug = req.query['slug'];
    let decodedSlug = base64Decode(encodedSlug);

    console.log('encodedSlug:', encodedSlug);
    console.log('decodedSlug:', decodedSlug);


    // Validate that it's a valid URL
    const urlRegexEasy = /^(http|https):\/\/[^ "]+$/;
    if (!urlRegexEasy.test(decodedSlug)) {
        console.log('Invalid URL, appending https://');
        decodedSlug = 'https://' + decodedSlug;
    }
    const urlRegexHard = /^(?:https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,20}(?:\/[\w\.-]*)*\/?$/;
    if (!urlRegexHard.test(decodedSlug)) {
        console.error('Still, invalid URL, aborting');
        res.status(400).json({ error: 'Invalid URL' });
        return;
    }

    const hash = crypto.createHash('sha256').update(decodedSlug).digest('hex');
    console.log('Hash:', hash);

    let uniqSlug = hash;

    const data = await getKey(uniqSlug);
    if(data == null || refresh != null){
        console.log("creating entry", uniqSlug, decodedSlug);
        const rawData = await makeRequest(decodedSlug, req.query['method'] || 'GET');
        const destination = rawData.destination;
        if(rawData.status == "500") { 
            console.log("error, will not save");
            res.status(200).json({ id: uniqSlug, destination: rawData.destination, instances: [rawData] });
        } else {
            await addData(uniqSlug, rawData, destination);
            const data = await getData(uniqSlug);
            console.log("new entry created", data);
            res.status(200).json({ id: uniqSlug, destination: data.destination, instances: data.instances });
        }
    } else {
        console.log("key found, will return");
        res.status(200).json({ id: uniqSlug, destination: data.destination, instances: data.instances });
    }   
}

function base64Decode(encodedStr) {
    const buffer = Buffer.from(encodedStr, 'base64');
    return buffer.toString('utf-8');
}


async function makeRequest(url, method) {
    const d1 = new Date().getTime();
    let latency = 0;
    let payload = [];
    let status = "";
    let statusText = "";

    try {
        // todo: add timeout
        const response = await fetch(url, {method: method});
        const data = await response;
        console.log("~~~", data);
        latency = new Date().getTime() - d1;

        // console.log("raw data: ", data);
        for (var pair of data.headers.entries()) {
            payload.push({"header": pair[0], "value": pair[1]});
        }
        status = "" + data.status;
        statusText = data.statusText;
    } catch (error) {
        console.log('There was an error', error);
        payload.push({"header": "error", "value": "network error"});
        status = "500";
        statusText = "network error";
    } 

    return {
        method: method,
        destination: url,
        payload: payload,
        status: status,
        statusText: statusText,
        timestamp: d1,
        latency: latency,
    };
}

async function getKey(uniq){
    const keyURL = process.env.UPSTASH_REDIS_REST_URL + "/get/" + uniq;

    console.log("getting keyurl: " + keyURL);
    const response = await fetch(keyURL, {
        headers: {
            Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN
        }
    })
    if(response.ok) {
        console.log("response ok");
        const fullData = await response.json();
        console.log("fullData: ", fullData)
        const data = await JSON.parse(fullData.result);
        return data;
    }
    else {
        console.log("key not found", uniq);
        return null;
    }
}

async function setKey(uniq, rawData) {
    console.log("uniq: ", uniq);

    const keyURL = process.env.UPSTASH_REDIS_REST_URL + "/set/" + uniq + "/";

    rawData.id = uniq;
    await fetch(keyURL, {
        headers: {
            Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN
        },
        body: JSON.stringify(rawData),
        method: "POST",
    })
        .then(response => response.ok ? response.json() : console.log("==ERR" + response))
        .then(data => console.log(data))
        .catch(err => console.log(err));
}

async function getData(uniq){
    const keyURL = process.env.UPSTASH_REDIS_REST_URL + "/get/" + uniq;

    console.log("getting keyurl: " + keyURL);
    const response = await fetch(keyURL, {
        headers: {
            Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN
        }
    })
    if(response.ok) {
        console.log("response ok");
        const fullData = await response.json();
        console.log("fullData: ", fullData)
        const data = await JSON.parse(fullData.result);
        if(data.schema != SCHEMA_VERSION) {
            console.log("schema mismatch, skipping");
            return null;
        }
        return data;    
    }
    else {
        console.log("key not found");
        return null;
    }
}

async function addData(uniq, rawData, destination){
    console.log("uniq: ", uniq);

    rawData.id = uniq;

    const getKeyURL = process.env.UPSTASH_REDIS_REST_URL + "/get/" + uniq;
    const setKeyURL = process.env.UPSTASH_REDIS_REST_URL + "/set/" + uniq + "/";

    const response = await fetch(getKeyURL, {
        headers: {
            Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN
        }
    })
    if(response.ok) {
        console.log("response ok");
        const fullData = await response.json();
        console.log("fullData: ", fullData)
        const data = await JSON.parse(fullData.result);
        if(data != null) {
            if(data.schema != SCHEMA_VERSION) {
                console.log("schema mismatch, will not save");
            }
            data.instances.push(rawData);
            if (data.instances.length > MAX_INSTANCES) {
                data.instances.shift();
            }
            await fetch(setKeyURL, {
                headers: {
                    Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN
                },
                body: JSON.stringify(data),
                method: "POST",
            }).then(response => response.ok ? response.json() : console.log("==ERR" + response)).then(data => console.log(data)).catch(err => console.log(err));
            return data;    
        }
    }

    console.log("key not found");
    const newEntry = {
        instances: [rawData],
        schema: SCHEMA_VERSION,
        id: uniq,
        destination: destination
    }
    await fetch(setKeyURL, {
        headers: {
            Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN
        },
        body: JSON.stringify(newEntry),
        method: "POST",
    }).then(response => response.ok ? response.json() : console.log("==ERR" + response)).then(data => console.log(data)).catch(err => console.log(err));                
    return newEntry;
}