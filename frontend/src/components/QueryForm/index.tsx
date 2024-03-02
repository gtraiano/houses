import { useStateValue } from "@/state/state";
import { HousesDBQueryKey } from "../../../../types";
import { camelCaseToRegular } from "@/utils/text";
import { setQuery } from "@/state/actions";
import { debounce } from "@/utils/debounce";

interface QueryBarProps {
    disabled?: boolean,
    defaultKey?: HousesDBQueryKey,      // default key
    exlcudeKeys?: HousesDBQueryKey[]    // keys to exclude
}

export default function QueryForm({ disabled = false, defaultKey = 'name', exlcudeKeys = ['id'] }: QueryBarProps) {
    const [{ query: { query, queryKeys } }, dispatch] = useStateValue();
    
    // exclude keys from list
    const filterKeys = (keys: HousesDBQueryKey[], list: HousesDBQueryKey[]) =>
        list.length ? keys.filter(k => !list.includes(k)) : keys;
    
    // update query on form input
    const onQueryFormInput = debounce((e: Event) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        dispatch(
            setQuery({
                ...query,
                [target.name]: target.value.trim()
            })
        );
    }, 1000);

    return (
        <form className="flex flex-col w-100 h-full" onInput={onQueryFormInput}>
            <fieldset className={`mb-3 ${disabled ? 'opacity-50' : ''}`} disabled={disabled}>
                <legend className="w-full mb-3 text-center font-bold uppercase tracking-widest">
                    query
                </legend>
                <div className="mb-3">
                    <label htmlFor="key" className="block mb-1">key</label>
                    <select
                        className="bg-white text-lg w-full rounded p-1"
                        name="key"
                        id="key"
                        defaultValue={defaultKey}
                    >
                        { filterKeys(queryKeys, exlcudeKeys).map(k => <option key={k} value={k}>{camelCaseToRegular(k)}</option>) }
                    </select>
                </div>
                <div>
                    <label htmlFor="text" className="block mb-1">value</label>
                    <input name="text" id="text" type="text" className='text-lg rounded p-1'/>
                </div>
            </fieldset>
        </form>
    )
}