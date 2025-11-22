import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MousePointerClick, Calendar, Clock, BarChart3, TrendingUp, Link as LinkIcon, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { getLinkStats, getRedirectUrl } from '../api/links';
import toast from 'react-hot-toast';

function StatsPage() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [link, setLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, [code]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await getLinkStats(code);
            setLink(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching stats:', err);
            if (err.response?.status === 404) {
                setError('Link not found');
            } else {
                setError('Failed to load link statistics');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const copyShortUrl = () => {
        const shortUrl = getRedirectUrl(code);
        navigator.clipboard.writeText(shortUrl);
        toast.success('Short URL copied to clipboard!', {
            style: {
                background: '#8B5E34',
                color: '#F7F2E8',
            },
        });
    };

    const shareStats = () => {
        const statsUrl = window.location.href;
        navigator.clipboard.writeText(statsUrl);
        toast.success('Stats link copied! Share it with your team.', {
            style: {
                background: '#8B5E34',
                color: '#F7F2E8',
            },
        });
    };

    // Enhanced mock data with realistic patterns
    const clickTrendData = [
        { date: 'Mon', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.12) : 12 },
        { date: 'Tue', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.18) : 18 },
        { date: 'Wed', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.22) : 22 },
        { date: 'Thu', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.25) : 25 },
        { date: 'Fri', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.15) : 15 },
        { date: 'Sat', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.05) : 5 },
        { date: 'Sun', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.03) : 3 },
    ];

    const deviceData = [
        { name: 'Desktop', value: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.55) : 55 },
        { name: 'Mobile', value: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.35) : 35 },
        { name: 'Tablet', value: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.1) : 10 },
    ];

    const locationData = [
        { country: 'India 🇮🇳', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.45) : 45 },
        { country: 'United States', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.25) : 25 },
        { country: 'United Kingdom', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.12) : 12 },
        { country: 'Singapore', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.08) : 8 },
        { country: 'Australia', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.06) : 6 },
        { country: 'Others', clicks: link?.clickCount > 0 ? Math.floor(link.clickCount * 0.04) : 4 },
    ];

    const COLORS = ['#8B5E34', '#A47148', '#C9A887', '#3B3024', '#6C5E51', '#F0E7DB'];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F7F2E8] via-[#F0E7DB] to-[#E4D8C8] flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <motion.div
                        className="inline-block rounded-full h-20 w-20 border-4 border-[#E4D8C8] border-t-[#8B5E34] mb-6"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.p
                        className="text-[#6C5E51] font-semibold text-xl"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Loading analytics...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F7F2E8] via-[#F0E7DB] to-[#E4D8C8] flex items-center justify-center px-4">
                <motion.div
                    className="bg-white/80 backdrop-blur-lg rounded-3xl p-12 max-w-md w-full text-center border border-white/50 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.div
                        className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        whileHover={{ scale: 1.1 }}
                    >
                        <BarChart3 className="w-12 h-12 text-red-600" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-[#3B3024] mb-4">Analytics Unavailable</h2>
                    <p className="text-[#6C5E51] text-lg mb-8">{error}</p>
                    <Link to="/" className="btn-primary inline-flex items-center gap-3 px-8 py-4">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                </motion.div>
            </div>
        );
    }

    const shortUrl = getRedirectUrl(code);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7F2E8] via-[#F0E7DB] to-[#E4D8C8] py-12 px-4 sm:px-6 lg:px-8">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-60 h-60 bg-[#8B5E34]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-60 h-60 bg-[#A47148]/5 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                className="max-w-7xl mx-auto relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Back Button */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg text-[#6C5E51] hover:text-[#8B5E34] transition-all duration-300 font-semibold group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                </motion.div>

                {/* Header Section */}
                <motion.div
                    className="text-center mb-8 md:mb-12"
                    variants={itemVariants}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <motion.div
                            className="p-4 sm:p-6 bg-gradient-to-br from-[#8B5E34] to-[#A47148] rounded-2xl sm:rounded-3xl shadow-2xl"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#3B3024] bg-gradient-to-r from-[#3B3024] to-[#8B5E34] bg-clip-text text-transparent">
                                Link Analytics
                            </h1>
                            <p className="text-[#6C5E51] text-base sm:text-lg md:text-xl mt-2 sm:mt-3 font-medium px-4">
                                Deep insights into your link performance
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                        variants={containerVariants}
                    >
                        <motion.div
                            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg"
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#6C5E51] font-medium">Total Clicks</p>
                                    <p className="text-3xl font-black text-[#3B3024]">{link.clickCount}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 shadow-lg"
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-[#6C5E51] font-medium">Last Click</p>
                                    <p className="text-sm sm:text-base md:text-lg font-bold text-[#3B3024] truncate">
                                        {link.lastClickedAt ? formatDate(link.lastClickedAt) : 'Never'}
                                    </p>
                                </div>

                                <div className="p-2 sm:p-3 bg-blue-100 rounded-xl shrink-0">
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                            </div>
                        </motion.div>


                        <motion.div
                            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg"
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#6C5E51] font-medium">Created</p>
                                    <p className="text-lg font-bold text-[#3B3024]">{formatDate(link.createdAt)}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Short Code Display Card */}
                <motion.div
                    className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 mb-12 border border-white/50 shadow-2xl relative overflow-hidden"
                    variants={itemVariants}
                >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#8B5E34]/10 to-transparent rounded-full -translate-y-40 translate-x-40"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <span className="text-sm text-[#6C5E51] uppercase tracking-widest font-semibold">Your Short Link</span>
                        </div>

                        <motion.div
                            className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8"
                            variants={itemVariants}
                        >
                            <motion.code
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#8B5E34] bg-[#F0E7DB] px-4 sm:px-6 md:px-8 py-4 md:py-6 rounded-2xl w-full md:flex-1 text-center md:text-left break-all"
                                whileHover={{ scale: 1.02 }}
                            >
                                /{code}
                            </motion.code>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
                                <motion.button
                                    onClick={copyShortUrl}
                                    className="btn-primary flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto min-h-[48px]"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="whitespace-nowrap">Copy URL</span>
                                </motion.button>
                                <motion.button
                                    onClick={shareStats}
                                    className="btn-secondary flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto min-h-[48px]"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="whitespace-nowrap">Share Stats</span>
                                </motion.button>
                            </div>
                        </motion.div>

                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm sm:text-base md:text-lg text-[#6C5E51] hover:text-[#8B5E34] transition-colors text-center block break-all px-4"
                        >
                            {shortUrl}
                        </a>
                    </div>
                </motion.div>

                {/* Enhanced Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
                    {/* Click Trend Chart */}
                    {/* <motion.div
                        className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-2xl"
                        variants={itemVariants}
                    >
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3B3024] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#8B5E34]" />
                            <span className="text-base sm:text-lg md:text-2xl">Click Trend (Last 7 Days)</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                            <AreaChart data={clickTrendData}>
                                <defs>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5E34" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8B5E34" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E4D8C8" />
                                <XAxis dataKey="date" stroke="#6C5E51" style={{ fontSize: '12px', fontWeight: '600' }} />
                                <YAxis stroke="#6C5E51" style={{ fontSize: '12px', fontWeight: '600' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #E4D8C8',
                                        borderRadius: '12px',
                                        color: '#3B3024',
                                        fontWeight: '600',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="#8B5E34"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorClicks)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div> */}

                    {/* Device Distribution */}
                    {/* <motion.div
                        className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-2xl"
                        variants={itemVariants}
                    >
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3B3024] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#8B5E34]" />
                            <span className="text-base sm:text-lg md:text-2xl">Device Distribution</span>
                        </h3>
                        <div className="flex items-center justify-center h-64 sm:h-72 md:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #E4D8C8',
                                            borderRadius: '12px',
                                            fontWeight: '600'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div> */}
                </div>

                {/* Location Distribution */}
                {/* <motion.div
                    className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-2xl mb-12"
                    variants={itemVariants}
                >
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3B3024] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <img src="https://png.pngtree.com/png-vector/20190115/ourmid/pngtree-black-map-coordinates-navigation-gps-navigation-png-image_368071.jpg" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" alt="Location" />
                        <span className="text-base sm:text-lg md:text-2xl">Top Locations</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                        <BarChart data={locationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E4D8C8" />
                            <XAxis dataKey="country" stroke="#6C5E51" style={{ fontSize: '12px', fontWeight: '600' }} />
                            <YAxis stroke="#6C5E51" style={{ fontSize: '12px', fontWeight: '600' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E4D8C8',
                                    borderRadius: '12px',
                                    fontWeight: '600'
                                }}
                            />
                            <Bar dataKey="clicks" fill="#8B5E34" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div> */}

                {/* Original URL Section */}
                <motion.div
                    className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 border border-white/50 shadow-2xl"
                    variants={itemVariants}
                >
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3B3024] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-[#F0E7DB] rounded-xl">
                            <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B5E34]" />
                        </div>
                        <span className="text-base sm:text-lg md:text-2xl">Original Destination</span>
                    </h2>
                    <div className="bg-[#F7F2E8] border border-[#E4D8C8] rounded-2xl p-6 break-all">
                        <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B5E34] hover:text-[#A47148] transition-colors text-sm sm:text-base md:text-lg font-medium flex items-start gap-2 sm:gap-3 break-all"
                        >
                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-1" />
                            {link.originalUrl}
                        </a>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default StatsPage;