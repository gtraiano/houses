import { HousesDBQueryResult } from "../../../../../types"
import ControllerRequest, { HousesAPIControllerEndpoint, HousesAPIControllerendpointConfig } from "../Request";

// API controller
export interface HousesAPIController {
    baseUrl: URL,                                                       // API base URL
    endpoints: {                                                        // controller endpoints
        [key: string]: Required<HousesAPIControllerEndpoint<HousesDBQueryResult>>
    }
}

export default class APIController implements APIController {
    baseUrl: URL;
    endpoints: HousesAPIController['endpoints'] = {};

    // return endpoint url
    public resolveEndpoint = (endpoint: string) => new URL(this.baseUrl + endpoint);

    public addEndpoint<E>(endpoint: HousesAPIControllerendpointConfig<E>) {
        const ep = new ControllerRequest<E>(this, {
            ...endpoint,
            
        });
        Object.assign(this.endpoints, { [ep.endpoint]: ep });
    }

    public setBaseUrl(url: URL) {
        this.baseUrl = url;
    }

    constructor(url: URL) {
        this.baseUrl = url;
    }
}
