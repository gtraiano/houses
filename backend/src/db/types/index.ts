import { HousesResponse, HousesResponseItem } from "../../../../types";

// database interface
export interface DB {
    houses: HousesResponse,                                 // db data
    synced: boolean,                                        // data fetched from API or using local copy
    init: (sync: boolean) => Promise<void>                  // initalize DB houses [sync=true to force fetching from remote API]
    query: (query: DBQuery | null) => HousesResponse,       // execute a query on houses items
    validQueryKeys: [keyof HousesResponseItem] | []
}

// database query interface
export interface DBQuery {
    key: DBQueryKey,
    text: string
}
// query only by object keys
export type DBQueryKey = keyof HousesResponseItem;