export default function AddImage() {
    return (
        <div className="flex flex-col-reverse">
            <div
                style={{height: 162, width: 162}}
                className="flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-12 w-12 text-gray-400"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </div>
        </div>
    )
}
