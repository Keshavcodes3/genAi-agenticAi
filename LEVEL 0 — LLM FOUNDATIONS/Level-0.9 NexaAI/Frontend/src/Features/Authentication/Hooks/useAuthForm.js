import { useState } from "react";

export const useAuthForm = (initialState) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ loading: false, message: "", type: "error" });

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
        setStatus((prev) => ({ ...prev, message: "" }));
    };

    return {
        values,
        errors,
        status,
        setValues,
        setErrors,
        setStatus,
        handleChange,
    };
};
