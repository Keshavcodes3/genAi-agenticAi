import {
    AlertCircle,
    CheckCircle2,
    X,
} from "lucide-react";

const variants = {
    error: {
        wrapper:
            "border-rose-200 bg-rose-50 text-rose-700",
        icon: AlertCircle,
    },

    success: {
        wrapper:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
    },
};

const AlertBanner = ({
    type = "error",
    message,
    onDismiss,
}) => {
    if (!message) return null;

    const {
        wrapper,
        icon: Icon,
    } =
        variants[type] ||
        variants.error;

    return (
        <div
            role="alert"
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${wrapper}`}
        >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />

            <p className="flex-1 leading-relaxed">
                {message}
            </p>

            {onDismiss && (
                <button
                    type="button"
                    onClick={
                        onDismiss
                    }
                    className="rounded-md p-0.5 opacity-70 transition hover:opacity-100"
                    aria-label="Dismiss message"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default AlertBanner;