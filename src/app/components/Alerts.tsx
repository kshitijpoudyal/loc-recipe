import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import {ErrorType} from "@/app/data/DataInterface";

interface AlertProps {
    message: string;
    type: ErrorType;
    onDismiss?: () => void;
}

export function Alert({ message, type, onDismiss }: AlertProps) {
    const alertStyles = {
        success: {
            bg: 'bg-green-100',
            iconColor: 'text-green-400',
            textColor: 'text-green-800',
            buttonColor: 'text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50',
        },
        error: {
            bg: 'bg-red-100',
            iconColor: 'text-red-400',
            textColor: 'text-red-800',
            buttonColor: 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50',
        },
    };

    const styles = alertStyles[type];

    return (
        <div className={`rounded-md p-4 ${styles.bg}`}>
            <div className="flex">
                <div className="shrink-0">
                    <CheckCircleIcon aria-hidden="true" className={`h-5 w-5 ${styles.iconColor}`} />
                </div>
                <div className="ml-3">
                    <p className={`text-sm font-medium ${styles.textColor}`}>{message}</p>
                </div>
                {onDismiss && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                type="button"
                                onClick={onDismiss}
                                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 ${styles.buttonColor}`}
                            >
                                <span className="sr-only">Dismiss</span>
                                <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}