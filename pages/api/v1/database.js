import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    const data = await makeDatabase();
    // console.log("returning database", data);
    res.setHeader('Cache-Control', 's-maxage=86400')
    res.status(200).json(data);
}

async function makeDatabase() {
    try {
        const data = await readJsonFilesFromDir(path.join(process.cwd() ,'json'));
        // console.log(data);
        return data;
    } catch (error) {
        console.log("error reading json file");
        console.log(error);
        return null;
    }
}

async function readJsonFilesFromDir(dirname) {
    const jsonFiles = fs.readdirSync(dirname).filter(filename => {
        return path.extname(filename).toLowerCase() === '.json';
    });

    const results = [];

    jsonFiles.forEach(file => {
        console.log("file: ", file);
        const filePath = path.join(dirname, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        results.push(data);
    });

    return results;
}