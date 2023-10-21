interface LeadProps {
    data: string;
}

export default function Lead(props: LeadProps) {
    return (
        <div className="w-40 max-h-32 md:max-h-fit break-words overflow-y-auto">
            {Object.entries(JSON.parse(props.data) as object).map(([key, value], index) => (
                <div key={index} className="text-sm"> {key}: <div className="ml-2 text-xs text-slate-600">{value}</div> </div>
            ))}
        </div>
    );
}