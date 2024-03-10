import { HousesDBQueryResult, HousesAPIResponseItem, HousesDBQueryKey } from "../../../../types";
import APIController from "./Controller";
import ControllerRequest from "./Request";

const fetcher = async (url: URL | string, abortController: AbortController | null) => {
    const response = await fetch(url, { signal: abortController?.signal });
    //if(!response.ok) return Promise.reject(response);
    if(!response.ok) throw new Error(`Request ${response.url} failed with status code ${response.status}${response.statusText && `[${response.statusText}]`}`);
    const data = await response.json();
    if(data.error) throw new Error(data.error);
    return data as HousesDBQueryResult;   
};

const baseUrl = new URL(`${process.env.BACKEND_URL}${process.env.BACKEND_PORT ? `:${process.env.BACKEND_PORT}` : ''}`);

const controller = new APIController(baseUrl);
// houses endpoint
controller.addEndpoint<HousesAPIResponseItem[]>({
    endpoint: 'houses',
    fetcher: async function(params: URLSearchParams | string[][]): Promise<HousesAPIResponseItem[]> {
        const self = this as ControllerRequest<HousesDBQueryResult>;
        const parent = self.controller as APIController;

        const url = parent.resolveEndpoint(this.endpoint);
        if(params) {
            Array.from((params as URLSearchParams).entries())
            .forEach(([p, v]) => {
                url.searchParams.append(p, v);
            });
        }
        const data = await fetcher(url, self.abortController) as HousesAPIResponseItem[];
        return data;
    },
    emptyResponse: []
});

// house/querykeys endpoint
controller.addEndpoint<HousesDBQueryKey[]>({
    endpoint: 'houses/querykeys',
    fetcher: async function() {
        const self = this as ControllerRequest<HousesDBQueryResult>;
        const parent = self.controller as APIController;

        const url = parent.resolveEndpoint(self.endpoint);
        return await fetcher(url, self.abortController) as HousesDBQueryKey[];
    },
    emptyResponse: []
});

export default controller;