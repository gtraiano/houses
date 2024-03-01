// typing API response
export type HousesAPIResponse = HousesAPIResponseItem[];

export interface HousesAPIResponseItem {
    id: string,
    name: string,
    houseColours: string,
    founder: string,
    animal: string,
    element: string,
    ghost: string,
    commonRoom: string,
    heads: Array<Head>,
    traits: Array<Trait>
}

export interface Head {
    id: string,
    firstName: string,
    lastName: string
}

export interface Trait {
    id: string,
    trait: string
}

// database interface
export interface HousesDB {
    houses: HousesAPIResponse,                                             // db data
    synced: boolean,                                                    // data fetched from API or using local copy
    init: (sync: boolean) => Promise<void>                              // initalize DB houses [sync=true to force fetching from remote API]
    query: (query: HousesDBQuery | null) => HousesDBQueryResult,        // execute a query on houses items
    validQueryKeys: [keyof HousesAPIResponseItem] | []
}

// database query interface
export interface HousesDBQuery {
    key: HousesDBQueryKey,
    text: string
}
// query only by object keys
export type HousesDBQueryKey = keyof HousesAPIResponseItem;
// database result type
export type HousesDBQueryResult = HousesAPIResponseItem[];