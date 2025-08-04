import {HttpClient, HttpClientConfig} from "bungie-api-ts/http"
import {DestinyManifestLanguage, getDestinyManifest, getDestinyManifestComponent} from "bungie-api-ts/destiny2"
import {DestinyManifestComponentName} from "bungie-api-ts/destiny2/manifest"
import {DestinyDisplayPropertiesDefinition} from "bungie-api-ts/destiny2/interfaces"
import {mkdir, writeFile} from "node:fs/promises"

function createHttpClient(key: string): HttpClient {
    return async function(config: HttpClientConfig) {
        const url = new URL(config.url)
        for(let key in config.params) {
            url.searchParams.set(key, config.params[key])
        }

        const r = await fetch(url, {
            method: config.method,
            body: config.body,
            headers: {
                "X-API-Key": key,
            },
        })
        return await r.json()
    }
}

let client
if(process.env.BUNGIE_API_KEY) {
    client = createHttpClient(process.env.BUNGIE_API_KEY)
} else {
    console.log("A Bungie api key is required!")
    process.exit(1)
}

const LANGUAGES: DestinyManifestLanguage[] = ["en", "zh-chs", "zh-cht"]
const TABLES: DestinyManifestComponentName[] = ["DestinyActivityDefinition"]

;(async function main() {
    const respManifest = await getDestinyManifest(client)
    if(respManifest.ErrorCode !== 1) {
        console.log("Invalid manifest response")
        console.log(respManifest)
        process.exit(1)
    }

    for(let tableName of TABLES) {
        for(let language of LANGUAGES) {
            console.log(`Fetching ${tableName} (${language})`)
            let tableData = (await getDestinyManifestComponent(client, {
                destinyManifest: respManifest.Response,
                language: language,
                tableName: tableName,
            })) as { [key: string]: { hash: number, displayProperties: DestinyDisplayPropertiesDefinition } }

            let result: { [key: number]: string } = {}
            const tableEntries = Object.values(tableData)
            for(let tableEntry of tableEntries) {
                result[tableEntry.hash] = tableEntry.displayProperties.name
            }

            await mkdir("./out/", {recursive: true})
            await writeFile(`./out/${tableName}_${language}.json`, JSON.stringify(result, null, 2), {
                flag: "w+",
            })
        }
    }
})().then(() => console.log("DONE"))
