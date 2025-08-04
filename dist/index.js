"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const destiny2_1 = require("bungie-api-ts/destiny2");
const promises_1 = require("node:fs/promises");
function createHttpClient(key) {
    return async function (config) {
        const url = new URL(config.url);
        for (let key in config.params) {
            url.searchParams.set(key, config.params[key]);
        }
        const r = await fetch(url, {
            method: config.method,
            body: config.body,
            headers: {
                "X-API-Key": key,
            },
        });
        return await r.json();
    };
}
let client;
if (process.env.BUNGIE_API_KEY) {
    client = createHttpClient(process.env.BUNGIE_API_KEY);
}
else {
    console.log("A Bungie api key is required!");
    process.exit(1);
}
const LANGUAGES = ["en", "zh-chs", "zh-cht"];
const TABLES = ["DestinyActivityDefinition"];
(async function main() {
    const respManifest = await (0, destiny2_1.getDestinyManifest)(client);
    if (respManifest.ErrorCode !== 1) {
        console.log("Invalid manifest response");
        console.log(respManifest);
        process.exit(1);
    }
    for (let tableName of TABLES) {
        for (let language of LANGUAGES) {
            console.log(`Fetching ${tableName} (${language})`);
            let tableData = (await (0, destiny2_1.getDestinyManifestComponent)(client, {
                destinyManifest: respManifest.Response,
                language: language,
                tableName: tableName,
            }));
            let result = {};
            const tableEntries = Object.values(tableData);
            for (let tableEntry of tableEntries) {
                result[tableEntry.hash] = tableEntry.displayProperties.name;
            }
            await (0, promises_1.mkdir)("./out/", { recursive: true });
            await (0, promises_1.writeFile)(`./out/${tableName}_${language}.json`, JSON.stringify(result, null, 2), {
                flag: "w+",
            });
        }
    }
})().then(() => console.log("DONE"));
