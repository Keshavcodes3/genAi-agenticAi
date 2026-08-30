import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordInput = ({
    id,
    label,
    value,
    onChange,
    placeholder = "Enter your password",
    error,
    autoComplete = "current-password",
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-slate-700"
            >
                {label}
            </label>

            <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                    id={id}
                    name={id}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${
                        error
                            ? "border-rose-400"
                            : "border-slate-200"
                    }`}
                />

                <button
                    type="button"
                    onClick={() => setVisible((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600"
                    aria-label={
                        visible
                            ? "Hide password"
                            : "Show password"
                    }
                >
                    {visible ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>

            {error && (
                <p className="text-xs text-rose-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default PasswordInput;