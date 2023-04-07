# Memo for the commands

To build : `npx nx run cli:build`

To initialize the lundprod project before starting it :

> `node ./dist/cli/main.js lundprod-init`

To fill the football events :

> `node ./dist/cli/main.js generate-sport-events --sport football --year 2022`

To fill the nba events :

> `node ./dist/cli/main.js generate-sport-events --sport nba --year 2022`

To fill the F1 events :

> `node ./dist/cli/main.js generate-sport-events --sport f1 --year 2023 --fromFile --file apps/cli/src/resources/f1.json`

_Could have been retrieved with the API but it doesn't provide F2, F3 and FE anyway so..._

To fill the F2 events :

> `node ./dist/cli/main.js generate-sport-events --sport f2 --year 2023 --fromFile --file apps/cli/src/resources/f2.json`

> To fill the F3 events :

> `node ./dist/cli/main.js generate-sport-events --sport f3 --year 2023 --fromFile --file apps/cli/src/resources/f3.json`

> To fill the FE events :

> `node ./dist/cli/main.js generate-sport-events --sport fe --year 2023 --fromFile --file apps/cli/src/resources/fe.json`
