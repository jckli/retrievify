export const ProgressBar = (props: any) => {
    return (
        <div className="h-1 w-full bg-[#505050] rounded-full">
            <div style={{ width: `${props.progress}%` }} className="h-full bg-primary rounded-full"></div>
        </div>
    );
};
