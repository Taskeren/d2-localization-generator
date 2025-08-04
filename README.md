# D2 Localization Generator

A script to grab the data from the Destiny 2 API and generate localization files.

## Usage

### Prerequisites

To use this script, you need to have a Bungie api key, which you can get it from
the [bungie.net](https://www.bungie.net/en/Application).
You'll pass the key as an environment variable `BUNGIE_API_KEY` when running the script.

### Modify the script

By default, it's used to generate translations for activity names (like raids, dungeons, etc.) in English, Chinese both
simplified and traditional.

You can add more subjects and languages by editing `TABLES` and `LANGUAGES` variable in the script.

Note, it only works for the entities (definitions) that have `$.hash` and `$.displayProperties.name` fields.

The `TABLES` is the table name of the definitions. You can get a list of tables
from [DestinySets](https://data.destinysets.com/), in the filter.

### Run the script

You can either run the script by `npm run run` or `node dist/index.js`, don't forget to set the environment variable.

#### PowerShell Example

```powershell
$env:BUNGIE_API_KEY="your_api_key_here"
npm run run
```

The generated files will be in the `out` folder in the current working directory, naming as
`{TABLE_NAME}_{LANGUAGE}.json`, like `DestinyActivityDefinition_en.json`.

## LICENSE

This script is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

The generated files belong to Bungie, and you should follow
the [Bungie.net Terms of Use](https://www.bungie.net/7/en/legal/terms).

I'm not affiliated with Bungie, and this script is not endorsed by Bungie. Use it at your own risk.
