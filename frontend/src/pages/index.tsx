import { useEffect, useState } from "react";
import QueryForm from "@/components/QueryForm";
import QueryResults from "@/components/QueryResults";
import { setQueryKeys, setItems } from "@/state/actions";
import { useStateValue } from "@/state";
import { HousesDBError } from "../../../types";
import housesAPIController from "@/controllers/HousesDB";

export default function Home() {
	const [{ query: { query } }, dispatch] = useStateValue();
	const [error, setError] = useState<HousesDBError | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [isBusy, setIsBusy] = useState<boolean>(false);


	// fetch valid query keys on mount
	useEffect(() => {
		setIsBusy(true);
		setMessage('Awaiting backend');
		housesAPIController.endpoints.queryKeys.request()
			.then(keys => {
				keys.length && dispatch(setQueryKeys(keys));
			})
			.catch(e => { setError(e); console.error(e); })
			.finally(() => { setIsBusy(false); setMessage(null); });
	}, []);

	// query API on query change
	useEffect(() => {
		const params = new URLSearchParams();
		params.append(query.key, query.text);
		if(query.key && query.text.length) {
			setIsBusy(true);
			housesAPIController.endpoints.houses.request(params)
				.then(data => { dispatch(setItems(data)); })
				.catch(e => { setError(e.error ? e : { error: e.message }); console.error(e); })
				.finally(() => { setIsBusy(false); });
		}
	}, [query]);

	return (
		<main className="flex flex-row place-content-center h-screen">
		<div className="flex gap-3 w-full p-4">
			<div className="w-1/8 column">
				<QueryForm disabled={isBusy}/>
			</div>
			<div className="w-screen column overflow-auto">
				<QueryResults busy={isBusy} message={message} error={error}/>
			</div>
		</div>
		</main>
	)
}
