interface LeadProps {
    data: string;
}

export default function Lead(props: LeadProps) {
    return (
        <div>
            {Object.entries(JSON.parse(props.data) as object).map(([key, value], index) => (
                <div key={index}> {key}: {value} </div>
            ))}
        </div>
    );
}