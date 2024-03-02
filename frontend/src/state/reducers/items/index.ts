import { ItemsAction } from "@/state/actions/items";
import { HousesAPIResponseItem, HousesDBQueryResult } from "../../../../../types";

export interface ItemsState {
    items: HousesDBQueryResult
}

export const reducer = (state: ItemsState, action: ItemsAction): ItemsState => {
    switch(action.type) {
        case 'SET_ITEMS':
            return {
                items: action.payload
            };
        case 'APPEND_ITEMS':
            return {
                items: [...state.items as HousesAPIResponseItem[], ...action.payload as HousesAPIResponseItem[]]
            };
        default:
            return state;
    }
}