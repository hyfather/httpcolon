
export default async function handler(req, res) {
    const slug = req.query["slug"];


    console.log("slug: ", slug[0]);
    const slugs = slug[0].split(",");
    const uniqSlug = slugs.join("_");
    const url = "https://" + slugs.join("/");
    console.log("uniqSlug: ", uniqSlug);

    if(slug[0] === null || uniqSlug === null) {
        res.status(200).json({ id: "Enter URL", destination: "Plz"});
        return;
    }

    const data = await getKey(uniqSlug);
    if(data == null){
        console.log("key not found, will create");
        await createKey(uniqSlug, url);
        console.log("key created======================");
        const data = await getKey(uniqSlug);
        res.status(200).json({ id: uniqSlug, destination: data.destination, timestamp: data.timestamp, latency: data.latency, status: data.status + " " + data.statusText, payload: data.payload });
    } else {
        console.log("key found, will return");
        res.status(200).json({ id: uniqSlug, destination: data.destination, timestamp: data.timestamp, latency: data.latency, status: data.status + " " + data.statusText, payload: data.payload });
    }
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
        console.log("key not found");
        return null;
    }
}

async function createKey(uniq, url){
    console.log("req url: ", url);
    console.log("uniq: ", uniq);
    
    const keyURL = process.env.UPSTASH_REDIS_REST_URL + "/set/" + uniq + "/";

    const d1 = new Date().getTime();
    let latency = 0;
    let payload = [];
    let status = "";
    let statusText = "";

    try {
        const response = await fetch(url);
        const data = await response;
        latency = new Date().getTime() - d1;
        console.log("raw data: ", data);
        for (var pair of data.headers.entries()) {
            // console.log(pair[0]+ ': '+ pair[1]);
            payload.push({"header": pair[0], "value": pair[1]});
        }
        status = data.status;
        statusText = data.statusText;
    } catch (error) {
        console.log('There was an error', error);
        payload.push({"header": "error", "value": "http error"});
        status = 500;
        statusText = "http error";
    } 

    await fetch(keyURL, {
        headers: {
            Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN
        },
        body: JSON.stringify({
            id: uniq,
            destination: url,
            payload: payload,
            status: status,
            statusText: statusText,
            timestamp: d1,
            latency: latency,
        }),
        method: "POST",
    }).then(response => response.ok ? response.json() : console.log("==ERR" + response)).then(data => console.log(data)).catch(err => console.log(err));
}