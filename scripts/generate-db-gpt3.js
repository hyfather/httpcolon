require('dotenv').config({ path: '../.env.local' });
// const openai = require('openai');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    // apiKey: "",
});
const openai = new OpenAIApi(configuration);

async function generateHTTPHeaderDoc(headerName) {
    try {
        const prompt = `Generate a JSON document for all possible directives of the "${headerName}" HTTP header, similar to the example below:\n\n{
      "header": "cache-control",
      "response-directives" : [
        {
          "directive": "max-age",
          "description": "The max-age=N response directive indicates that the response remains fresh until N seconds after the response is generated.",
          "details": "Note that max-age is not the elapsed time since the response was received; it is the elapsed time since the response was generated on the origin server. So if the other cache(s) — on the network route taken by the response — store the response for 100 seconds (indicated using the Age response header field), the browser cache would deduct 100 seconds from its freshness lifetime."
        }
      ]
    }`;

        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 1024,
            n: 1,
            stop: '\n\n',
            temperature: 0.5,
            api_key: process.env.OPENAI_API_KEY,
        });

        const reviver = (key, value) => {
            if (typeof value === 'string') {
                return value.replace(/\n/g, '');
            }
            return value;
        };

        return JSON.parse(response.data.choices[0].text.trim(), reviver)
        // return response.data.choices[0];
        // return response;
    } catch (err) {
        console.log(err);
        return null;
    }
}


(async function() {
    const headerName = 'age';
    const doc = await generateHTTPHeaderDoc(headerName);
    console.log("-----------------");
    console.log(doc);
})();

