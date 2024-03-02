import { URLSearchParams } from "url";
import { HousesAPIResponseItem, HousesDBError, HousesDBQueryKey, HousesDBQueryResult } from "../../../../types";

export interface HousesDBController {
    baseUrl: URL,
    abortController: AbortController,
    fetchers: {
        fetchQueryKeys: () => Promise<HousesDBQueryKey[]>,
        queryHousesDB: (params: URLSearchParams | string[][]) => Promise<HousesDBQueryResult>
    }
}

// API base url
const baseUrl = new URL(`${process.env.BACKEND_URL}${process.env.BACKEND_PORT ? `:${process.env.BACKEND_PORT}` : ''}/houses`);
// abort controller (not currently used)
const abortController = new AbortController();

// general fetcher
const fetcher = async (url: URL | string): Promise<HousesDBQueryResult> => {
    const response = await fetch(url, abortController);
    const data = await response.json();
    if(!response.ok) throw Error((data as HousesDBError).error);
    return data as HousesDBQueryResult;
}

// fetcher for /houses/querykeys
const fetchQueryKeys = async (): Promise<HousesDBQueryKey[]>  => {
    const keys = await fetcher(baseUrl + '/querykeys');
    return keys as HousesDBQueryKey[];
}

// fetcher for /houses?params
const queryHousesDB = async (params: URLSearchParams | string[][]): Promise<HousesDBQueryResult> => {
    const url = new URL(baseUrl);
    Array.from((params as URLSearchParams).entries() ?? params)
        .forEach(([p, v]) => {
            url.searchParams.append(p, v);
        });
    return await fetcher(url) as HousesAPIResponseItem[];
}

const housesDBController: HousesDBController = Object.seal({
    baseUrl,
    abortController,
    fetchers: {
        fetchQueryKeys,
        queryHousesDB
    }
});

export default housesDBController;