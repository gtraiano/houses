import { useStateValue } from "@/state/state";
import { HousesAPIResponseItem, HousesDBError } from "../../../../types";
import HouseCard from "../HouseCard";
import Spinner from "../Spinner";
import { useEffect, useState } from "react";

interface QueryResultsProps {
    busy: boolean,
    message?: string | null,
    error?: HousesDBError | null
}

export default function QueryResults({ busy, message, error }: QueryResultsProps) {
    const [{ items: { items }, query: { query: { text } } }] = useStateValue();
    const [hasResults, setHasResults] = useState<boolean>(false);
    
    useEffect(() => {
        setHasResults((items as HousesAPIResponseItem[]).length > 0 && text.length > 0);
    }, [items, text]);
    
    const resultsClassNames = () => [
        'lg:grid lg:gap-1 lg:grid-cols-4 p-4 auto-rows-auto',
        hasResults ? 'visible' : 'invisible',
        'self-start',
        'w-full',
        hasResults ? 'h-full' : 'h-0',
        hasResults ? 'opacity-1' : 'opacity-0',
        'transition-opacity'
    ].join(' ');
    
    // spinner presented in an overlay
    const spinnerClassNames = () => [
        !busy ? 'invisible' : 'visible',
        !busy ? 'h-0' : 'h-full',
        'bg-slate-400',
        'bg-opacity-75',
        'w-full',
        !busy ? 'opacity-0' : 'opacity-1',
        'absolute',
        'top-0',
        'left-0',
        'transition-opacity',
        'rounded-lg'
    ].join(' ');
    
    const messageClassNames = () => [
        'text-lg',
        busy || hasResults ? 'invisible' : 'visible',
        hasResults ? 'h-0' : '',
        'overflow-hidden'
    ].join(' ');

    // on error show message and render nothing else
    if(error) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-lg text-red-500">
                { (error as HousesDBError).error }
            </div>
        )
    }
    // render query results, spinner while busy, and message if no results or query
    return (
        <div className="flex flex-col h-full overflow-auto items-center justify-center relative">
            <ul className={resultsClassNames()}>{
                (items as HousesAPIResponseItem[]).map(h => <li key={h.id} className="mb-3"><HouseCard house={h}/></li>)
            }</ul>
            <span className={messageClassNames()}>
                {text.length && !(items as HousesAPIResponseItem[]).length ? 'No results' : 'Enter a query'}
            </span>
            <div className={spinnerClassNames()}><Spinner message={message}/></div>
        </div>
    )
}