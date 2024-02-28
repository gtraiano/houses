// simple DB interface for API data, all operations performed in memory
// only Read operations currently allowed
import { HousesResponse, HousesResponseItem } from "../../../types";
import { fetchHouses } from "../controllers/houses";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

// local JSON file path
const filePath = path.join(__dirname, "./data/houses.json");

// database interface
interface DB {
    houses: HousesResponse,                         // db data
    synced: boolean,                                // data fetched from API or using local copy
    init: (sync: boolean) => Promise<void>          // initalize DB houses [sync=true to force fetching from remote API]
    query: (query: DBQuery) => HousesResponse       // execute a query on houses items
}

// database query interface
interface DBQuery {
    key: keyof HousesResponseItem,
    text: string
}

const isValidKey = (item: HousesResponseItem, key: string): boolean => {
    const keys = Object.keys(item);
    return keys.includes(key);
}

// query function
const queryFunc = (items: HousesResponse, query: DBQuery) => {
    const { key, text } = query;
    if(!isValidKey(items[0], key)) throw Error(`$Query key ${key} is not valid`);

    // regular expression for comparison
    const searchRE = new RegExp(text.trim(), 'gi');
    
    return items.filter(item => {
        // using logical OR for traits and heads sub-objects
        // iterate through all object's values
        if(key === 'traits' || key === 'heads') {
            return item[key].findIndex(t => Object.values(t).reduce((truth, val) => truth || searchRE.test(val), false)) !== -1;
        }
        else if(typeof item[key] === 'string') {
            return searchRE.test(item[key]);
        }
        else return false;
    });
}

const db: DB = {
    houses: [],
    synced: false,

    init: async function(sync: boolean = false) {
        // local file exists
        const exists = existsSync(filePath);
        let data: HousesResponse;
        
        if(!sync && exists) {
            // parse local copy
            data = JSON.parse(readFileSync(filePath).toString());
        }
        else {
            data = await fetchHouses();
            // update local copy
            writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            this.synced = true;
        }
        this.houses = data;
    },

    query: function(query: DBQuery) {
        return queryFunc(this.houses, query);
    }
}

export default Object.seal(db);