import { HousesDBQueryResult } from "../../../../../types";

export type ItemsAction = 
{
    type: 'SET_ITEMS',
    payload: HousesDBQueryResult
}
|
{
    type: 'APPEND_ITEMS',
    payload: HousesDBQueryResult
};

export const setItems = (items: HousesDBQueryResult): ItemsAction => {
    return {
        type: 'SET_ITEMS',
        payload: items
    }
};

export const appendItems = (items: HousesDBQueryResult): ItemsAction => {
    return {
        type: 'APPEND_ITEMS',
        payload: items
    }
}