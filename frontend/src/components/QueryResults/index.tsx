import { useStateValue } from "@/state/state";
import { HousesDBQueryResult } from "../../../../types";
import HouseCard from "../HouseCard";

interface QueryResultsProps {
    items: HousesDBQueryResult,
}

export default function QueryResults() {
    const [{ items }] = useStateValue();
    if(!items.items.length) return null;
    return (
        <div>
            <ul>{
                items.items.map(h => <li key={h.id} className="mb-3"><HouseCard house={h}/></li>)
            }</ul>
        </div>
    )
}