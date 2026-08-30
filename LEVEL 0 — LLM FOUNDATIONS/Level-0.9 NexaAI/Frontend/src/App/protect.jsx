import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "../Features/Authentication/Redux/auth.slice.js";

const MIN_SKELETON_MS = 450;

const ProtectSkeleton = () => {
    const messageRows = [72, 88, 56];

    return (
        <div className="min-h-screen w-full overflow-hidden bg-orange-50 text-orange-950">
            <div className="flex h-screen">
                <aside className="hidden w-72 shrink-0 border-r border-orange-100 bg-white p-4 md:block">
                    <div className="mb-8 h-10 w-36 animate-pulse rounded-lg bg-orange-200/80" />
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="h-12 animate-pulse rounded-lg bg-orange-100"
                                style={{ animationDelay: `${item * 80}ms` }}
                            />
                        ))}
                    </div>
                </aside>

                <main className="flex min-w-0 flex-1 flex-col">
                    <header className="flex h-16 items-center justify-between border-b border-orange-100 bg-white/85 px-5">
                        <div className="h-5 w-40 animate-pulse rounded bg-orange-200/80" />
                        <div className="h-9 w-9 animate-pulse rounded-full bg-orange-300/80" />
                    </header>

                    <section className="flex flex-1 items-center justify-center px-5">
                        <div className="w-full max-w-3xl space-y-6">
                            <div className="mx-auto h-14 w-14 animate-pulse rounded-2xl bg-orange-400/70 shadow-[0_0_45px_rgba(251,146,60,0.35)]" />
                            <div className="mx-auto h-7 w-64 animate-pulse rounded bg-orange-200/80" />
                            <div className="space-y-4">
                                {messageRows.map((width, index) => (
                                    <div
                                        key={width}
                                        className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
                                    >
                                        <div
                                            className="mb-3 h-4 animate-pulse rounded bg-orange-200/80"
                                            style={{ width: `${width}%`, animationDelay: `${index * 120}ms` }}
                                        />
                                        <div
                                            className="h-4 animate-pulse rounded bg-orange-100"
                                            style={{ width: `${Math.max(width - 18, 34)}%`, animationDelay: `${index * 160}ms` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

const Protect = ({ children }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
    const [hasVerifiedUser, setHasVerifiedUser] = useState(false);
    const [canLeaveSkeleton, setCanLeaveSkeleton] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setCanLeaveSkeleton(true);
        }, MIN_SKELETON_MS);

        return () => {
            window.clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated && user) {
            return;
        }

        let isActive = true;

        dispatch(fetchMe()).finally(() => {
            if (isActive) {
                setHasVerifiedUser(true);
            }
        });

        return () => {
            isActive = false;
        };
    }, [dispatch, isAuthenticated, user]);

    if (isAuthenticated && user) {
        return children || <Outlet />;
    }

    if (loading || !hasVerifiedUser || !canLeaveSkeleton) {
        return <ProtectSkeleton />;
    }

    return <Navigate to="/login" replace state={{ from: location }} />;
};

export default Protect;
