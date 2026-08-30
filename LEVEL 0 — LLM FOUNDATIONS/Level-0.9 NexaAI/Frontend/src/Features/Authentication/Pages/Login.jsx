import { Mail } from "lucide-react";
import AuthLayout from "../Components/AuthLayout.jsx";
import FormField from "../Components/FormField.jsx";
import PasswordInput from "../Components/PasswordInput.jsx";
import AuthButton from "../Components/AuthButton.jsx";
import AlertBanner from "../Components/AlertBanner.jsx";
import { useAuthForm } from "../Hooks/useAuthForm.js";
import { useAuth } from "../Hooks/useAuth.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const validateLogin = ({ email, password }) => {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email.";
    if (!password) errors.password = "Password is required.";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters.";
    return errors;
};

const Login = ({ onSuccess }) => {
    const { handleLogin, loading, error, message, clearError } = useAuth();
    const { values, errors, status, setErrors, setStatus, handleChange } = useAuthForm({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        clearError();

        const validationErrors = validateLogin(values);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        setStatus({ loading: true, message: "", type: "error" });

        const { success, data, error: loginError } = await handleLogin(values);

        if (success) {
            setStatus({
                loading: false,
                message: data?.message || "Login successful.",
                type: "success",
            });
            onSuccess?.(data);
            navigate('/chat');
        } else {
            setStatus({
                loading: false,
                message: loginError || "Login failed.",
                type: "error",
            });
        }
    };

    const alertMessage = status.message || error || message;
    const alertType = status.type === "success" || message ? "success" : "error";

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to pick up where you left off."
            footer={
                <p>
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-orange-500 transition hover:text-orange-600"
                    >
                        Create one
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <AlertBanner
                    type={alertType}
                    message={alertMessage}
                    onDismiss={() => setStatus((prev) => ({ ...prev, message: "" }))}
                />

                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    icon={Mail}
                    value={values.email}
                    onChange={handleChange("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                    error={errors.email}
                />

                <PasswordInput
                    id="password"
                    label="Password"
                    value={values.password}
                    onChange={handleChange("password")}
                    error={errors.password}
                    autoComplete="current-password"
                />

                <AuthButton loading={loading || status.loading}>Sign in</AuthButton>
            </form>
        </AuthLayout>
    );
};

export default Login;
