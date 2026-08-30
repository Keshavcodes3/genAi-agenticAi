import { Sparkles } from "lucide-react";
import { SiOpenai } from "react-icons/si";

const highlights = [
    "Search with context-aware answers",
    "Organize chats in one workspace",
    "Fast, focused research flow",
];

const AuthLayout = ({
    title,
    subtitle,
    children,
    footer,
}) => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-orange-200/50 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-100/50 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
            {/* Left side */}
            <section className="hidden lg:block">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100 px-4 py-1.5 text-xs font-medium text-orange-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Nexa AI
                </div>

                <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                    Ask smarter.
                    <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                        Research faster.
                    </span>
                </h1>

                <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
                    Sign in to continue your conversations,
                    save history, and get precise answers
                    powered by AI.
                </p>

                <ul className="mt-8 space-y-4">
                    {highlights.map(
                        (item) => (
                            <li
                                key={item}
                                className="flex items-center gap-3 text-sm text-slate-700"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                                    <SiOpenai className="h-3 w-3" />
                                </span>

                                {item}
                            </li>
                        )
                    )}
                </ul>
            </section>

            {/* Right side */}
            <section className="mx-auto w-full max-w-md">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                    <header className="mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                            {title}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {subtitle}
                        </p>
                    </header>

                    {children}
                </div>

                {footer && (
                    <div className="mt-6 text-center text-sm text-slate-500">
                        {footer}
                    </div>
                )}
            </section>
        </div>
    </div>
);

export default AuthLayout;