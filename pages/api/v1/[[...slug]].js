
export default async function handler(req, res) {
    const slug = req.query["slug"];


    console.log("slug: ", slug[0]);
    const slugs = slug[0].split(",");
    const uniqSlug = slugs.join("_");
    const url = "https://" + slugs.join("/");
    console.log("uniqSlug: ", uniqSlug);

    const keyURL = process.env.UPSTASH_REDIS_REST_URL + "/get/" + uniqSlug;

    console.log("keyurl: " + keyURL);
    const response = await fetch(keyURL, {
        headers: {
            Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN
        }
    })
    const fullData = await response.json();
    const data = await JSON.parse(fullData.result);
    if(data == null){ 
        await createKey(uniqSlug, url);
        console.log("======================");
        res.redirect(307, req.url);
    } else {
        res.status(200).json({ id: uniqSlug, destination: data.destination, timestamp: data.timestamp, latency: data.latency, status: data.status + " " + data.statusText, headers: data.headers });
    }
}


async function createKey(uniq, url){
    console.log("req url: ", url);
    console.log("uniq: ", uniq);
    
    const keyURL = process.env.UPSTASH_REDIS_REST_URL + "/set/" + uniq + "/";

    const d1 = new Date().getTime();
    const response = await fetch(url);
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
            destination: url,
            headers: headers,
            status: response.status,
            statusText: response.statusText,
            timestamp: d1,
        }),
        method: "POST",
    }).then(response => response.json())
    .then(data => console.log(data));
}