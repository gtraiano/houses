import { HousesAPIResponseItem, HousesDBError, HousesDBQueryKey, HousesDBQueryResult } from "../../../../types"

// API request
export interface HousesAPIControllerRequest<T> {
    endpoint: string,                           // endpoint
    abortController?: AbortController | null,   // abort controller
    abort?: () => void,                         // abort request
    request: (...args: any) => Promise<T>       // request fetcher
}

// API controller
interface HousesAPIController {
    baseUrl: URL,                                                       // API base URL
    endpoints: {
        queryKeys: HousesAPIControllerRequest<HousesDBQueryKey[]>,      // /houses/querykeys endpoint
        houses: HousesAPIControllerRequest<HousesDBQueryResult>,        // /houses endpoint
        [key: string]: HousesAPIControllerRequest<HousesDBQueryResult>  // further endpoints to be added
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
        const keys = await this.fetcher(this.resolveEndpoint(this.endpoints.queryKeys.endpoint), null);
        return keys as HousesDBQueryKey[];
    }

    // fetcher for /houses?parameter=value
    private queryHousesDB = async (params: URLSearchParams | string[][]): Promise<HousesDBQueryResult> => {
        // abort running request
        if(!this.endpoints.houses.abortController) this.endpoints.houses.abortController = new AbortController();
        else this.endpoints.houses.abortController.abort();
        
        // append parameters to url
        //const url = new URL(this.baseUrl + this._fetchers.houses.endpoint);
        const url = this.resolveEndpoint(this.endpoints.houses.endpoint);
        Array.from((params as URLSearchParams).entries() ?? params)
            .forEach(([p, v]) => {
                url.searchParams.append(p, v);
            });
        const data = await this.fetcher(url, this.endpoints.houses.abortController) as HousesAPIResponseItem[];
        
        // prepare for next request
        this.endpoints.houses.abortController = null;
        
        return data;
    }

    // return endpoint url
    private resolveEndpoint = (endpoint: string) => new URL(this.baseUrl + endpoint);

    public addEndpoint(endpoint: HousesAPIControllerRequest<HousesDBQueryResult>) {
        Object.assign(this.endpoints, { [endpoint.endpoint]: endpoint });
    }

    public setBaseUrl(url: URL) {
        this.baseUrl = url;
    }
    
    constructor(url: URL) {
        this.baseUrl = url;
        // default endpoints
        this.endpoints = {
            queryKeys: {
                endpoint: 'houses/querykeys',
                request: this.fetchQueryKeys  
            },
            houses: {
                endpoint: 'houses',
                abortController: null,
                request: this.queryHousesDB,
                abort: function() {
                    this.abortController && (this.abortController as AbortController).abort();
                }
            }
        };
    }
}

const url = new URL(`${process.env.BACKEND_URL}${process.env.BACKEND_PORT ? `:${process.env.BACKEND_PORT}` : ''}`);
const housesAPIController = new HousesAPIController(url);

export default housesAPIController;