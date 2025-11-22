import { useState } from "react";
import { Link as LinkIcon, Loader2, Check, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LinkForm({ onLinkCreated }) {
    const [originalUrl, setOriginalUrl] = useState("");
    const [customCode, setCustomCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validateCode = (code) => {
        if (!code) return true;
        return /^[A-Za-z0-9]{6,8}$/.test(code);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!originalUrl) return setError("Please enter a URL");

        if (!validateUrl(originalUrl))
            return setError("Please enter a valid URL (include http:// or https://)");

        if (customCode && !validateCode(customCode))
            return setError("Custom code must be 6–8 alphanumeric characters");

        setLoading(true);

        try {
            await onLinkCreated(originalUrl, customCode);
            setSuccess(true);
            setOriginalUrl("");
            setCustomCode("");
            setTimeout(() => setSuccess(false), 2500);
        } catch (err) {
            if (err.response?.status === 409) setError("This code already exists.");
            else setError("Failed to create link. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Success Confetti Effect */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-[#8B5E34] text-2xl"
                                initial={{
                                    x: "50%",
                                    y: "50%",
                                    scale: 0,
                                    opacity: 1
                                }}
                                animate={{
                                    x: `${Math.random() * 100}%`,
                                    y: `${Math.random() * 100}%`,
                                    scale: [0, 1, 0],
                                    opacity: [1, 1, 0],
                                    rotate: Math.random() * 360
                                }}
                                transition={{
                                    duration: 1.5,
                                    delay: i * 0.1
                                }}
                            >
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                <motion.div
                    className="p-3 sm:p-4 bg-gradient-to-br from-[#8B5E34] to-[#A47148] rounded-xl sm:rounded-2xl shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <LinkIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#F7F2E8]" />
                </motion.div>
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#3B3024] bg-gradient-to-r from-[#3B3024] to-[#8B5E34] bg-clip-text text-transparent">
                        Create Short Link
                    </h2>
                    <p className="text-[#6C5E51] mt-1 sm:mt-2 font-medium text-sm sm:text-base px-4 sm:px-0">
                        Transform long URLs into elegant, shareable links
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* URL field */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="text-sm font-semibold text-[#5B5044] mb-3 block flex items-center gap-2">
                        <span>Destination URL</span>
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            placeholder="https://your-very-long-website-url.com/path/to/page"
                            className="input-field text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6 pr-10 sm:pr-12 rounded-2xl border-2 border-[#E4D8C8] focus:border-[#8B5E34] transition-all duration-300 bg-white/50 backdrop-blur-sm w-full"
                            disabled={loading}
                        />
                        <motion.div
                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                            animate={{ scale: originalUrl ? 1 : 0.8 }}
                        >
                            <LinkIcon className="w-5 h-5 text-[#8B5E34]" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Custom Code Field */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="block text-sm font-semibold text-[#5B5044] mb-3">
                        Custom Code{" "}
                        <span className="text-[#7E7268] font-normal ml-2">
                            (Optional, 6–8 alphanumeric characters)
                        </span>
                    </label>
                    <div className="relative">
                        <input
                            value={customCode}
                            onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                            placeholder="MYBRAND"
                            maxLength={8}
                            className="input-field text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6 pr-10 sm:pr-12 rounded-2xl border-2 border-[#E4D8C8] focus:border-[#8B5E34] transition-all duration-300 bg-white/50 backdrop-blur-sm font-mono w-full"
                            disabled={loading}
                        />
                        <motion.div
                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                            animate={{ scale: customCode ? 1 : 0.8 }}
                        >
                            <span className="text-sm text-[#8B5E34] font-bold">/{customCode || "..."}</span>
                        </motion.div>
                    </div>
                    <p className="text-xs text-[#7E7268] mt-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Leave empty for auto-generated magic
                    </p>
                </motion.div>

                {/* Error message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Success message */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-2xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Check className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">Link created successfully! Redirecting to analytics...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-4 sm:py-5 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 relative overflow-hidden min-h-[48px]"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {loading && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    )}
                    {loading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Creating Magic...
                        </>
                    ) : (
                        <>
                            <LinkIcon className="w-6 h-6" />
                            Create Short Link
                        </>
                    )}
                </motion.button>
            </form>

            {/* Quick Tips */}
            <motion.div
                className="mt-6 sm:mt-8 p-4 sm:p-6 bg-[#F0E7DB]/50 rounded-2xl border border-[#E4D8C8]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h4 className="font-semibold text-[#3B3024] mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Sparkles className="w-4 h-4" />
                    Pro Tips
                </h4>
                <ul className="text-xs sm:text-sm text-[#6C5E51] space-y-1 sm:space-y-2">
                    <li>• Use custom codes for branded links (e.g., /MYBRAND)</li>
                    <li>• Track performance with real-time analytics</li>
                    <li>• Share shortened links across social media</li>
                </ul>
            </motion.div>
        </motion.div>
    );
}

export default LinkForm;