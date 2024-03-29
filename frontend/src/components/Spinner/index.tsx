// credit https://tw-elements.com/docs/standard/components/spinners/

interface SpinnerProps {
    message?: string | null
}

export default function Spinner({ message }: SpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div
                className="inline-block h-10 w-10 mb-2 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
            >
                <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                />
            </div>
            {message?.trim().length && <span className="select-none">{message}</span>}
        </div>
    )
}