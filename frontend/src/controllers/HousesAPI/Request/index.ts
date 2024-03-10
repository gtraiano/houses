import { HousesDBError } from '../../../../../types';
import { HousesAPIController } from '../Controller';

export interface HousesAPIControllerEndpoint<T> {
    endpoint: string,                           // endpoint
    abortController: AbortController | null,    // abort controller
    busy: boolean,                              // endpoint is busy
    abort: () => void,                          // abort request
    fetcher: (...args: any) => Promise<T>,      // request fetcher
    request: (...args: any) => Promise<T>,      // perform request
    controller: HousesAPIController,            // parent object
    emptyResponse: T                            // return as empty response
}

export type HousesAPIControllerendpointConfig<T> = Pick<HousesAPIControllerEndpoint<T>, 'endpoint' | 'fetcher' | 'emptyResponse'>;

export default class ControllerRequest<T> implements Required<HousesAPIControllerEndpoint<T>> {
    endpoint = '';
    abortController: AbortController | null = null;
    busy = false;
    error: Error | null = null;
    fetcher: (...args: any) => Promise<T>;
    controller: HousesAPIController;
    emptyResponse: T;
    
    constructor(controller: HousesAPIController, config: HousesAPIControllerendpointConfig<T>) {
        this.endpoint = config.endpoint;
        this.abortController = null;
        this.busy = false;
        this.fetcher = config.fetcher;
        this.controller = controller;
        this.emptyResponse = config.emptyResponse
    }

    public request = async (...args: any): Promise<T> => {
        let data = this.emptyResponse;
        let error: Error | HousesDBError | null = null;
        try {
            if(this.busy) this.abort();
            if(this.abortController?.signal.aborted) this.abortController = new AbortController();
            this.busy = true;
            data = await this.fetcher(...args);
        }
        catch(e: any) {
            if(!(e instanceof DOMException && e.name === 'AbortError')) {
                error = e;
            }
        }
        finally {
            this.abortController = null;
            this.busy = false;
            if(error) throw error;
            return data;
        }
    }

    public abort = () => {
        this.abortController !== null && this.abortController.abort();
    }
}
