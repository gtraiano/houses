import { ItemsAction } from "@/state/actions/items";
import { HousesDBQueryResult } from "../../../../../types";

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
                items: [...state.items, ...action.payload]
            };
        default:
            return state;
    }
}