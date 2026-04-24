import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'default';
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'default',
}: ConfirmDialogProps) {
    return (
        <Dialog open={isOpen} onClose={onCancel} className="relative z-[80]">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="w-full max-w-sm transform rounded-2xl bg-surface-container-lowest p-6 shadow-xl transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{title}</h3>
                    <p className="font-body text-sm text-on-surface-variant mb-6">{message}</p>
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2 rounded-full font-label font-medium text-sm text-on-surface-variant border border-outline-variant hover:bg-surface-container-low transition-colors"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`px-5 py-2 rounded-full font-label font-medium text-sm transition-colors ${
                                variant === 'danger'
                                    ? 'bg-error text-on-error hover:opacity-90'
                                    : 'bg-primary text-on-primary hover:opacity-90'
                            }`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
