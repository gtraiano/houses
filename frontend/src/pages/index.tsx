import { useEffect } from "react";
import QueryForm from "@/components/QueryForm";
import QueryResults from "@/components/QueryResults";
import { setQueryKeys, setItems } from "@/state/actions";
import { useStateValue } from "@/state";

export default function Home() {
	const [{ query: { query, queryKeys, url } }, dispatch] = useStateValue();

	// fetch valid query keys on mount
	useEffect(() => {
		fetch(`${url}/querykeys`)
			.then(res => res.json())
			.then(keys => {
				keys.length && dispatch(setQueryKeys(keys));
			})
			.catch(e => { console.error(e); });
	}, []);

	// query API on query change
	useEffect(() => {
		const qUrl = new URL(url);
		qUrl.searchParams.append(query.key, query.text);
		if(query.key && query.text.length) {
			fetch(qUrl)
				.then(res => res.json())
				.then(data => { dispatch(setItems(data)); })
				.catch(e => { console.error(e); })
		}
	}, [query]);

	return (
		<div className="container">
			<div className="column side">
				<QueryForm keys={queryKeys} />
			</div>
			<div className="column">
				<QueryResults/>
			</div>
		</div>
	)
}
