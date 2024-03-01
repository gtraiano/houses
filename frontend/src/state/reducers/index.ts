import { State } from "../state";
import { Action } from "../actions";
import { ItemsAction } from "../actions/items";
import { HousesDBQueryAction } from "../actions/query";
import { reducer as itemsReducer } from "./items";
import { reducer as queryReducer } from "./query";

export const reducer = (
    { items, query }: State,
    action: Action
): State => ({
    items: itemsReducer(items, action as ItemsAction),
    query: queryReducer(query, action as HousesDBQueryAction)
});