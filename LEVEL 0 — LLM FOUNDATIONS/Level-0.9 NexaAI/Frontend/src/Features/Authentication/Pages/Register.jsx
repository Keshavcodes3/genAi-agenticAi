import { useState } from "react";
import { Mail, User, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../Components/AuthLayout.jsx";
import FormField from "../Components/FormField.jsx";
import PasswordInput from "../Components/PasswordInput.jsx";
import AvatarUpload from "../Components/AvatarUpload.jsx";
import AuthButton from "../Components/AuthButton.jsx";
import AlertBanner from "../Components/AlertBanner.jsx";
import { useAuthForm } from "../Hooks/useAuthForm.js";
import { useAuth } from "../Hooks/useAuth.jsx";
import { Link } from "react-router-dom";
import { AVATAR_OPTIONS } from "../Utils/constants.js";

const validateStep1 = ({ name }) => {
    const errors = {};
    if (!name.trim()) {
        errors.name = "Name is required.";
    } else if (name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters.";
    }
    return errors;
};

const validateStep2 = ({ email, password }) => {
    const errors = {};
    if (!email.trim()) {
        errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Enter a valid email.";
    }
    if (!password) {
        errors.password = "Password is required.";
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters.";
    }
    return errors;
};

const Register = ({ onSuccess }) => {
    const { handleRegister, loading, error, message, clearError } = useAuth();
    const [step, setStep] = useState(1);

    const {
        values,
        errors,
        status,
        setErrors,
        setStatus,
        handleChange,
        setValues,
    } = useAuthForm({
        name: "",
        email: "",
        password: "",
    });

    const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);

    const handleContinue = (e) => {
        e.preventDefault();
        clearError();
        
        const validationErrors = validateStep1({
            name: values.name,
        });

        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setStep(2);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("[Register Page] Step 2 submitted. Email:", values.email);
        clearError();

        const validationErrors = validateStep2({
            email: values.email,
            password: values.password,
        });

        if (Object.keys(validationErrors).length) {
            console.warn("[Register Page] Step 2 validation failed:", validationErrors);
            setErrors(validationErrors);
            return;
        }

        setStatus({ loading: true, message: "", type: "error" });

        const { success, data, error: registerError } = await handleRegister({
            ...values,
            avatar,
        });

        if (success) {
            setStatus({
                loading: false,
                message: data?.message || "Account created successfully.",
                type: "success",
            });
            setValues({ name: "", email: "", password: "" });
            setAvatar(AVATAR_OPTIONS[0]);
            onSuccess?.(data);
        } else {
            setStatus({
                loading: false,
                message: registerError || "Registration failed.",
                type: "error",
            });
        }
    };

    const alertMessage = status.message || error || message;
    const alertType = status.type === "success" ? "success" : "error";

    const slideVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Build, search, and explore with AI in one workspace."
            footer={
                <p className="text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-orange-500 transition hover:text-orange-600"
                    >
                        Sign in
                    </Link>
                </p>
            }
        >
            <form onSubmit={step === 1 ? handleContinue : handleSubmit} className="space-y-6" noValidate>
                <AlertBanner
                    type={alertType}
                    message={alertMessage}
                    onDismiss={() => setStatus((prev) => ({ ...prev, message: "" }))}
                />

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={slideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <AvatarUpload
                                selectedAvatar={avatar}
                                onChange={setAvatar}
                            />

                            <FormField
                                id="name"
                                label="Full name"
                                icon={User}
                                value={values.name}
                                onChange={handleChange("name")}
                                placeholder="Keshav Sharma"
                                autoComplete="name"
                                error={errors.name}
                            />

                            <AuthButton
                                type="submit"
                                className="w-full rounded-xl bg-orange-500 py-3 font-medium text-white shadow-sm transition hover:bg-orange-600"
                            >
                                Continue
                            </AuthButton>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={slideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <FormField
                                id="email"
                                label="Email address"
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
                                placeholder="At least 6 characters"
                                error={errors.password}
                                autoComplete="new-password"
                            />

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex w-1/3 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </button>
                                <AuthButton
                                    type="submit"
                                    loading={loading || status.loading}
                                    className="w-2/3 rounded-xl bg-orange-500 py-3 font-medium text-white shadow-sm transition hover:bg-orange-600"
                                >
                                    Create account
                                </AuthButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </AuthLayout>
    );
};

export default Register;
