import { HousesDBQuery, HousesDBQueryKey } from "../../../../../types";

export type HousesDBQueryAction = 
{
    type: 'SET_QUERY_KEYS',
    payload: HousesDBQueryKey[]
}
|
{
    type: 'SET_QUERY_URL',
    payload: URL
}
|
{
    type: 'SET_QUERY',
    payload: HousesDBQuery
};

export const setQueryKeys = (list: HousesDBQueryKey[]): HousesDBQueryAction => {
    return {
        type: 'SET_QUERY_KEYS',
        payload: list
    }
};

export const setQueryUrl = (url: URL): HousesDBQueryAction => {
    return {
        type: 'SET_QUERY_URL',
        payload: url
    }
};

export const setQuery = (query: HousesDBQuery): HousesDBQueryAction => {
    return {
        type: 'SET_QUERY',
        payload: query
    }
};