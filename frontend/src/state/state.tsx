import { createContext, useReducer, useContext } from "react";
import { ItemsState } from "./reducers/items";
import { QueryState } from "./reducers/query";
import { Action } from "./actions";

// app state
export interface State {
	items: ItemsState,
	query: QueryState
}

// initial values
const initialState: State = {
	items: {
		items: []
	},
	query: {
		queryKeys: ['name'],
		query: { key: 'name', text: '' },
		url: new URL(`${process.env.BACKEND_URL}${process.env.BACKEND_PORT ? `:${process.env.BACKEND_PORT}` : ''}/houses`)
	}
}

// context
export const StateContext = createContext<[State, React.Dispatch<Action>]>([
	initialState,
	() => initialState
]);

export const store = createContext({
	state: initialState
});

type StateProviderProps = {
	reducer: React.Reducer<State, Action>;
	children: React.ReactElement;
};

// context provider
export const StateProvider: React.FC<StateProviderProps> = ({
	reducer,
	children
}: StateProviderProps) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<StateContext.Provider value={[state, dispatch]}>
			{children}
		</StateContext.Provider>
	);
};

export const useStateValue = () => useContext(StateContext);