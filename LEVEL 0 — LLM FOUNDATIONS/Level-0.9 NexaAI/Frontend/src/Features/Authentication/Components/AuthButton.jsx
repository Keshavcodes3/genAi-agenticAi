import { Loader2 } from "lucide-react";
const AuthButton = ({
    children,
    loading,
    type = "submit",
    className = "",
    ...props
}) => (
    <button
        type={type}
        disabled={loading}
        className={`flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        {...props}
    >
        {loading && (
            <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {children}
    </button>
);

export default AuthButton;
