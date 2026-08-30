const FormField = ({
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    autoComplete,
    icon: Icon,
    ...props
}) => (
    <div className="space-y-2">
        <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-700"
        >
            {label}
        </label>

        <div className="relative">
            {Icon && (
                <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            )}

            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`w-full rounded-xl border bg-white py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${
                    Icon ? "pl-10 pr-4" : "px-4"
                } ${
                    error
                        ? "border-rose-400"
                        : "border-slate-200"
                }`}
                {...props}
            />
        </div>

        {error && (
            <p className="text-xs text-rose-500">
                {error}
            </p>
        )}
    </div>
);

export default FormField;