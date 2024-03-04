import { HousesAPIResponseItem, HousesDBError, HousesDBQueryKey, HousesDBQueryResult } from "../../../../types"

// API request
interface HousesAPIControllerRequest<T> {
    abortController?: AbortController | null,   // abort controller per operation
    request: (...args: any) => Promise<T>       // request function
}

// API controller
interface HousesAPIController {
    baseUrl: URL,
    fetchers: {
        queryKeys: HousesAPIControllerRequest<HousesDBQueryKey[]>,
        houses: HousesAPIControllerRequest<HousesDBQueryResult>
    }
}

class HousesAPIController implements HousesAPIController {
    // general fetcher
    private async fetcher(url: URL | string, abortController: AbortController | null): Promise<HousesDBQueryResult> {
        const response = await fetch(url, { signal: abortController?.signal });
        const data = await response.json();
        if(!response.ok) throw Error((data as HousesDBError).error);
        return data as HousesDBQueryResult;
    }
    
    // fetcher for /houses/querykeys
    private fetchQueryKeys = async (): Promise<HousesDBQueryKey[]> => {
        const keys = await this.fetcher(this.baseUrl + '/querykeys', null);
        return keys as HousesDBQueryKey[];
    }

    // fetcher for /houses?parameter=value
    private queryHousesDB = async (params: URLSearchParams | string[][]): Promise<HousesDBQueryResult> => {
        // abort running request
        if(!this.fetchers.houses.abortController) this.fetchers.houses.abortController = new AbortController();
        else this.fetchers.houses.abortController.abort();
        
        // append parameters to url
        const url = new URL(this.baseUrl);
        Array.from((params as URLSearchParams).entries() ?? params)
            .forEach(([p, v]) => {
                url.searchParams.append(p, v);
            });
        const data = await this.fetcher(url, this.fetchers.houses.abortController) as HousesAPIResponseItem[];
        
        // prepare for next request
        this.fetchers.houses.abortController = null;
        
        return data;
    }

    private _fetchers = {
        queryKeys: {
            request: this.fetchQueryKeys  
        },
        houses: {
            abortController: null,
            request: this.queryHousesDB    
        }
    }

    public setBaseUrl(url: URL) {
        this.baseUrl = url;
    }
    
    constructor(url: URL) {
        this.baseUrl = url;
        this.fetchers = this._fetchers;
    }
}

const url = new URL(`${process.env.BACKEND_URL}${process.env.BACKEND_PORT ? `:${process.env.BACKEND_PORT}` : ''}/houses`);
const housesAPIController = new HousesAPIController(url);

export default housesAPIController;