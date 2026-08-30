import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AVATAR_OPTIONS } from "../Utils/constants.js";

const AvatarUpload = ({ selectedAvatar, onChange }) => {
    const selectedIndex = Math.max(AVATAR_OPTIONS.indexOf(selectedAvatar), 0);

    const changeAvatar = (direction) => {
        const nextIndex =
            (selectedIndex + direction + AVATAR_OPTIONS.length) % AVATAR_OPTIONS.length;
        onChange(AVATAR_OPTIONS[nextIndex]);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="block text-sm font-medium text-slate-700">
                    Choose your avatar
                </span>
                <span className="text-xs font-medium text-orange-500">
                    {selectedIndex + 1} / {AVATAR_OPTIONS.length}
                </span>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                <div className="flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => changeAvatar(-1)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-500 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
                        aria-label="Previous avatar"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg shadow-orange-200/70">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedAvatar}
                                src={selectedAvatar}
                                alt="Selected avatar"
                                className="h-full w-full object-cover"
                                initial={{ opacity: 0, x: 40, scale: 0.92 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -40, scale: 0.92 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            />
                        </AnimatePresence>

                        <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm">
                            <Check className="h-4 w-4" />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => changeAvatar(1)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-500 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
                        aria-label="Next avatar"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-4 flex justify-center gap-2">
                    {AVATAR_OPTIONS.map((avatar, index) => (
                        <button
                            key={avatar}
                            type="button"
                            onClick={() => onChange(avatar)}
                            className={`h-2.5 rounded-full transition-all ${
                                index === selectedIndex
                                    ? "w-8 bg-orange-500"
                                    : "w-2.5 bg-orange-200 hover:bg-orange-300"
                            }`}
                            aria-label={`Choose avatar ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvatarUpload;
