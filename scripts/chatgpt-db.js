import { ChatGPTAPI } from 'chatgpt'

async function example() {
    const api = new ChatGPTAPI({
        apiKey: process.env.OPENAI_API_KEY
    })

    const res = await api.sendMessage('Hello World!')
    console.log(res.text)
}

(async function() {
    const doc = await example();
    console.log("-----------------");
    console.log(doc);
})();
