// simple DB interface for API data, all operations performed in memory
// only Read operations currently allowed
import { HousesDBQueryKey, HousesDB, HousesDBQuery, HousesResponse } from "../../../types";
import { fetchHouses } from "../controllers/houses";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

// local JSON file path
const fileDirectory = path.join(__dirname, "./data/");
const filePath = path.join(fileDirectory, "./houses.json");

// updates local JSON file
const syncfile = (data: any) => {
    if(!existsSync(fileDirectory)) {
        mkdirSync(fileDirectory);
    }
    writeFileSync(filePath, JSON.stringify(data, null, 2), { flag: 'w', encoding: 'utf-8' });
}

// check query key validity
const isValidQueryKey = (db: HousesDB, key: string): boolean => db.validQueryKeys.findIndex(k => k === key) !== -1;

// query function
const queryFunc = (db: HousesDB, query: HousesDBQuery| null) => {
    // empty query, return all items
    if(!query || !query.key || !query.text) return db.houses;
    
    // check key is valid
    const { key, text } = query;
    if(!isValidQueryKey(db, key)) throw Error(`Query key ${key} is not valid`);

    // regular expression for comparison
    const searchRE = new RegExp(text.trim(), 'gi');
    
    return db.houses.filter(item => {
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

const db: HousesDB = {
    houses: [],
    synced: false,
    validQueryKeys: [],
    init: async function(sync: boolean = false) {
        try {
            // local file exists
            const exists = existsSync(filePath);
            let data: HousesResponse;
            
            if(!sync && exists) {
                // parse local copy
                data = JSON.parse(readFileSync(filePath).toString());
            }
            else {
                // fetch from remote API and update local copy
                data = await fetchHouses();
                syncfile(data);
                this.synced = true;
            }
            this.houses = data;
            this.validQueryKeys = Object.keys(data[0]) as [HousesDBQueryKey];
        }
        catch(e) {
            console.error(e);
            this.houses = JSON.parse(readFileSync(filePath).toString());
        }
    },

    query: function(query: HousesDBQuery | null) {
        return queryFunc(this, query);
    }
}

export default Object.seal(db);