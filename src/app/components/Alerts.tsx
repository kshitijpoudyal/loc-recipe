import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

interface AlertProps {
    message: string;
}

export function SuccessAlertWithDismissIcon({ message }: AlertProps) {
    return (
        <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
                <div className="shrink-0">
                    <CheckCircleIcon aria-hidden="true" className="size-5 text-green-400" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{message}</p>
                </div>
                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            type="button"
                            className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                        >
                            <span className="sr-only">Dismiss</span>
                            <XMarkIcon aria-hidden="true" className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ErrorAlertWithDismissIcon({ message }: AlertProps) {
    return (
        <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
                <div className="shrink-0">
                    <CheckCircleIcon aria-hidden="true" className="size-5 text-red-400" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{message}</p>
                </div>
                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            type="button"
                            className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                        >
                            <span className="sr-only">Dismiss</span>
                            <XMarkIcon aria-hidden="true" className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
