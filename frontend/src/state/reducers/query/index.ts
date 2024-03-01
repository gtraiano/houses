import { HousesDBQueryKey, HousesDBQuery } from "../../../../../types";
import { HousesDBQueryAction } from "@/state/actions/query";

export interface QueryState {
    queryKeys: HousesDBQueryKey[],
    query: HousesDBQuery,
    url: URL
}

export const reducer = (state: QueryState, action: HousesDBQueryAction): QueryState => {
    switch (action.type) {
        case 'SET_QUERY_KEYS':
            return {
                ...state,
                queryKeys: action.payload
            }
        case 'SET_QUERY_URL':
            return {
                ...state,
                url: action.payload
            }
        case 'SET_QUERY':
            return {
                ...state,
                query: action.payload
            }
        default:
            return state;
    }
};