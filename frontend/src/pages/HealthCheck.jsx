import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle, XCircle, RefreshCw, Clock, Server, Zap, Globe } from 'lucide-react';
import { checkHealth } from '../api/health';
import toast from 'react-hot-toast';

function HealthCheck() {
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastChecked, setLastChecked] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchHealth = async () => {
        try {
            setLoading(true);

            const startTime = performance.now();
            const response = await fetch("https://tinyurl-generator-4wmc.vercel.app/healthz", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const endTime = performance.now();

            const responseTime = Math.round(endTime - startTime);
            const body = await response.json();

            setHealthData({
                ...body,
                responseTime,
                timestamp: new Date().toISOString(),
                backendUrl: "https://tinyurl-generator-4wmc.vercel.app"
            });

            setError(null);
            setLastChecked(new Date());
        } catch (err) {
            setError({
                ok: false,
                error: err.message,
                responseTime: 0,
                timestamp: new Date().toISOString(),
                backendUrl: "https://tinyurl-generator-4wmc.vercel.app"
            });
            setHealthData(null);
        } finally {
            setLoading(false);
        }
    };


    console.log("healthcheck is active");

    useEffect(() => {
        fetchHealth();
    }, []);

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetchHealth();
        }, 10000); // Auto-refresh every 10 seconds

        return () => clearInterval(interval);
    }, [autoRefresh]);

    const handleManualRefresh = () => {
        toast.success('Refreshing health status...', {
            style: {
                background: '#8B5E34',
                color: '#F7F2E8',
            },
        });
        fetchHealth();
    };

    const formatTime = (date) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const isHealthy = healthData?.ok === true;
    const statusColor = isHealthy ? 'from-green-400 to-emerald-500' : 'from-red-400 to-rose-500';
    const statusBg = isHealthy ? 'bg-green-50' : 'bg-red-50';
    const statusBorder = isHealthy ? 'border-green-200' : 'border-red-200';

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7F2E8] via-[#F0E7DB] to-[#E4D8C8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-60 h-60 bg-[#8B5E34]/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-60 h-60 bg-[#A47148]/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
            </div>

            <motion.div
                className="max-w-4xl mx-auto relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                {/* Header */}
                <motion.div
                    className="text-center mb-8 sm:mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <motion.div
                            className="p-4 sm:p-6 bg-gradient-to-br from-[#8B5E34] to-[#A47148] rounded-2xl sm:rounded-3xl shadow-2xl"
                            animate={{
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Activity className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#3B3024] bg-gradient-to-r from-[#3B3024] to-[#8B5E34] bg-clip-text text-transparent">
                                System Health
                            </h1>
                            <p className="text-[#6C5E51] text-base sm:text-lg md:text-xl mt-2 sm:mt-3 font-medium px-4 sm:px-0">
                                Backend service monitoring & diagnostics
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Main Status Card */}
                <motion.div
                    className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 sm:p-10 mb-8 border border-white/50 shadow-2xl relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {loading && !healthData && (
                        <div className="text-center py-12">
                            <motion.div
                                className="inline-block rounded-full h-16 w-16 border-4 border-[#E4D8C8] border-t-[#8B5E34] mb-6"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <p className="text-[#6C5E51] font-semibold text-lg">Checking backend status...</p>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {!loading && (healthData || error) && (
                            <motion.div
                                key={isHealthy ? 'healthy' : 'error'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Status Header */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-8">
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            className={`p-4 rounded-2xl ${statusBg} border-2 ${statusBorder}`}
                                            animate={isHealthy ? {
                                                scale: [1, 1.1, 1],
                                            } : {
                                                scale: [1, 0.9, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            {isHealthy ? (
                                                <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
                                            ) : (
                                                <XCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-600" />
                                            )}
                                        </motion.div>
                                        <div>
                                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3B3024]">
                                                {isHealthy ? 'All Systems Operational' : 'Service Unavailable'}
                                            </h2>
                                            <p className="text-sm sm:text-base text-[#6C5E51] mt-1">
                                                {isHealthy ? 'Backend is running smoothly' : 'Unable to connect to backend'}
                                            </p>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={handleManualRefresh}
                                        className="btn-primary flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] text-sm sm:text-base"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={loading}
                                    >
                                        <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
                                        <span className="whitespace-nowrap">Refresh</span>
                                    </motion.button>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {/* Response Time */}
                                    <motion.div
                                        className="bg-[#F0E7DB]/50 rounded-2xl p-4 sm:p-6 border border-[#E4D8C8]"
                                        whileHover={{ scale: 1.02, y: -5 }}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-blue-100 rounded-xl">
                                                <Zap className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <span className="text-xs sm:text-sm font-semibold text-[#6C5E51]">Response Time</span>
                                        </div>
                                        <p className="text-2xl sm:text-3xl font-black text-[#3B3024]">
                                            {healthData?.responseTime || error?.responseTime || 0}ms
                                        </p>
                                    </motion.div>

                                    {/* Version */}
                                    <motion.div
                                        className="bg-[#F0E7DB]/50 rounded-2xl p-4 sm:p-6 border border-[#E4D8C8]"
                                        whileHover={{ scale: 1.02, y: -5 }}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-purple-100 rounded-xl">
                                                <Server className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <span className="text-xs sm:text-sm font-semibold text-[#6C5E51]">Version</span>
                                        </div>
                                        <p className="text-2xl sm:text-3xl font-black text-[#3B3024]">
                                            {healthData?.version || 'N/A'}
                                        </p>
                                    </motion.div>

                                    {/* Last Checked */}
                                    <motion.div
                                        className="bg-[#F0E7DB]/50 rounded-2xl p-4 sm:p-6 border border-[#E4D8C8]"
                                        whileHover={{ scale: 1.02, y: -5 }}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-orange-100 rounded-xl">
                                                <Clock className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <span className="text-xs sm:text-sm font-semibold text-[#6C5E51]">Last Checked</span>
                                        </div>
                                        <p className="text-lg sm:text-xl font-bold text-[#3B3024]">
                                            {formatTime(lastChecked)}
                                        </p>
                                    </motion.div>

                                    {/* Backend URL */}
                                    <motion.div
                                        className="bg-[#F0E7DB]/50 rounded-2xl p-4 sm:p-6 border border-[#E4D8C8] sm:col-span-2 lg:col-span-1"
                                        whileHover={{ scale: 1.02, y: -5 }}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-green-100 rounded-xl">
                                                <Globe className="w-5 h-5 text-green-600" />
                                            </div>
                                            <span className="text-xs sm:text-sm font-semibold text-[#6C5E51]">Backend URL</span>
                                        </div>
                                        <p className="text-sm sm:text-base font-bold text-[#3B3024] break-all">
                                            {healthData?.backendUrl || error?.backendUrl || 'Unknown'}
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Error Details */}
                                {error && (
                                    <motion.div
                                        className="mt-6 p-4 sm:p-6 bg-red-50 border-2 border-red-200 rounded-2xl"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                    >
                                        <h3 className="text-base sm:text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                                            <XCircle className="w-5 h-5" />
                                            Error Details
                                        </h3>
                                        <p className="text-sm sm:text-base text-red-700">
                                            {error.error || 'Failed to connect to backend service'}
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Auto-refresh Toggle */}
                <motion.div
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-[#3B3024] mb-1">Auto-Refresh</h3>
                            <p className="text-xs sm:text-sm text-[#6C5E51]">
                                Automatically check status every 10 seconds
                            </p>
                        </div>
                        <motion.button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 min-h-[48px] ${autoRefresh
                                ? 'bg-gradient-to-r from-[#8B5E34] to-[#A47148] text-white shadow-lg'
                                : 'bg-[#E4D8C8] text-[#6C5E51]'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {autoRefresh ? 'Enabled' : 'Disabled'}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default HealthCheck;
