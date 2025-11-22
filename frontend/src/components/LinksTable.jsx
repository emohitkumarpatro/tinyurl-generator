import { Link } from 'react-router-dom';
import { ExternalLink, Trash2, BarChart3, Copy, Check, Eye, Calendar } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRedirectUrl } from '../api/links';
import toast from 'react-hot-toast';

function LinksTable({ links, onDelete }) {
    const [copiedCode, setCopiedCode] = useState(null);

    const copyToClipboard = async (code) => {
        const shortUrl = getRedirectUrl(code);
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopiedCode(code);
            toast.success('Link copied to clipboard!', {
                style: {
                    background: '#8B5E34',
                    color: '#F7F2E8',
                },
            });
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy link');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getClickVariant = (clickCount) => {
        if (clickCount === 0) return { color: 'from-gray-400 to-gray-500', text: 'No clicks yet' };
        if (clickCount < 10) return { color: 'from-blue-400 to-blue-500', text: 'Getting started' };
        if (clickCount < 50) return { color: 'from-green-400 to-green-500', text: 'Popular' };
        if (clickCount < 100) return { color: 'from-orange-400 to-orange-500', text: 'Very popular' };
        return { color: 'from-red-400 to-red-500', text: 'Viral!' };
    };

    if (links.length === 0) {
        return (
            <motion.div
                className="bg-white/80 backdrop-blur-lg rounded-3xl p-16 text-center border border-white/50 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="flex flex-col items-center gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.div
                        className="p-8 bg-gradient-to-br from-[#F0E7DB] to-[#E4D8C8] rounded-full"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <ExternalLink className="w-16 h-16 text-[#8B5E34]" />
                    </motion.div>

                    <div>
                        <h3 className="text-3xl font-bold text-[#3B3024] mb-4">No links created yet</h3>
                        <p className="text-[#6C5E51] text-lg max-w-md mx-auto">
                            Create your first shortened URL to start tracking analytics and sharing beautiful links.
                        </p>
                    </div>

                    {/* <motion.img
                        src="https://cdn.pixabay.com/photo/2016/10/10/14/46/icon-1728549_1280.jpg"
                        alt="Empty state link illustration"
                        className="w-80 opacity-90 mt-4 drop-shadow-lg"
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    /> */}
                </motion.div>
            </motion.div>
        );
    }


    return (
        <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            {/* Enhanced Header */}
            <div className="p-8 bg-gradient-to-r from-[#F0E7DB] to-[#E4D8C8] border-b border-[#C9A887]/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="p-3 bg-gradient-to-br from-[#8B5E34] to-[#A47148] rounded-xl shadow-lg"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                            <BarChart3 className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                            <h2 className="text-3xl font-black text-[#3B3024]">Your Links</h2>
                            <p className="text-[#6C5E51] font-medium">Manage and track your shortened URLs</p>
                        </div>
                    </div>
                    <motion.div
                        className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl font-bold text-[#3B3024] shadow-lg border border-white/50"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {links.length} {links.length === 1 ? 'Link' : 'Links'}
                    </motion.div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="block lg:hidden divide-y divide-[#E4D8C8]/50">
                <AnimatePresence>
                    {links.map((link, index) => {
                        const clickVariant = getClickVariant(link.clickCount);
                        return (
                            <motion.div
                                key={link.id}
                                className="p-6 hover:bg-white/50 transition-all duration-300"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <code className="text-[#8B5E34] font-black text-xl bg-[#F0E7DB] px-4 py-2 rounded-xl border border-[#E4D8C8]">
                                            /{link.code}
                                        </code>
                                        <motion.button
                                            onClick={() => copyToClipboard(link.code)}
                                            className="p-2 hover:bg-[#E4D8C8] rounded-xl transition-colors"
                                            whileTap={{ scale: 0.9 }}
                                            title="Copy short URL"
                                        >
                                            {copiedCode === link.code ? (
                                                <Check className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Copy className="w-5 h-5 text-[#8B5E34]" />
                                            )}
                                        </motion.button>
                                    </div>

                                    {/* URL */}
                                    <a
                                        href={link.originalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[#5B5044] hover:text-[#8B5E34] transition-colors line-clamp-2 flex items-start gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" />
                                        {link.originalUrl}
                                    </a>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between">
                                        <motion.span
                                            className={`px-4 py-2 rounded-full text-sm font-black text-white bg-gradient-to-r ${clickVariant.color} shadow-md`}
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {link.clickCount} clicks
                                        </motion.span>
                                        <div className="flex items-center gap-2 text-[#6C5E51] text-xs">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(link.createdAt)}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        <Link
                                            to={`/code/${link.code}`}
                                            className="flex-1 btn-secondary text-center text-sm py-3 flex items-center justify-center gap-2 rounded-xl"
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            Analytics
                                        </Link>
                                        <motion.button
                                            onClick={() => onDelete(link.code)}
                                            className="flex-1 btn-danger text-sm py-3 flex items-center justify-center gap-2 rounded-xl"
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#F0E7DB]/50">
                        <tr>
                            <th className="px-8 py-6 text-left text-sm font-black text-[#3B3024] uppercase tracking-wider">
                                Short Code
                            </th>
                            <th className="px-8 py-6 text-left text-sm font-black text-[#3B3024] uppercase tracking-wider">
                                Original URL
                            </th>
                            <th className="px-8 py-6 text-center text-sm font-black text-[#3B3024] uppercase tracking-wider">
                                Performance
                            </th>
                            <th className="px-8 py-6 text-left text-sm font-black text-[#3B3024] uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-8 py-6 text-center text-sm font-black text-[#3B3024] uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4D8C8]/30">
                        <AnimatePresence>
                            {links.map((link, index) => {
                                const clickVariant = getClickVariant(link.clickCount);
                                return (
                                    <motion.tr
                                        key={link.id}
                                        className="hover:bg-white/50 transition-all duration-300 group"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        whileHover={{ scale: 1.002 }}
                                    >
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <motion.code
                                                    className="text-[#8B5E34] font-black text-lg bg-[#F0E7DB] px-4 py-2.5 rounded-xl border border-[#E4D8C8] group-hover:bg-[#E4D8C8] transition-colors"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    /{link.code}
                                                </motion.code>
                                                <motion.button
                                                    onClick={() => copyToClipboard(link.code)}
                                                    className="p-2.5 hover:bg-[#E4D8C8] rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-sm"
                                                    whileTap={{ scale: 0.9 }}
                                                    title="Copy short URL"
                                                >
                                                    {copiedCode === link.code ? (
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-[#8B5E34]" />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-md">
                                            <a
                                                href={link.originalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#5B5044] hover:text-[#8B5E34] transition-colors group/url flex items-center gap-3 font-medium"
                                            >
                                                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate group-hover/url:underline">
                                                    {link.originalUrl}
                                                </span>
                                            </a>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <motion.span
                                                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-black text-white bg-gradient-to-r ${clickVariant.color} shadow-lg`}
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ type: "spring", stiffness: 400 }}
                                                >
                                                    <Eye className="w-3 h-3 mr-2" />
                                                    {link.clickCount}
                                                </motion.span>
                                                <span className="text-xs text-[#6C5E51] font-medium">
                                                    {clickVariant.text}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-[#6C5E51] font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(link.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link
                                                    to={`/code/${link.code}`}
                                                    className="p-3 hover:bg-[#8B5E34] hover:text-white text-[#8B5E34] rounded-xl transition-all duration-300 shadow-sm border border-[#E4D8C8] hover:border-[#8B5E34] group/analytics"
                                                    title="View detailed analytics"
                                                >
                                                    <BarChart3 className="w-5 h-5 group-hover/analytics:scale-110 transition-transform" />
                                                </Link>
                                                <motion.button
                                                    onClick={() => onDelete(link.code)}
                                                    className="p-3 hover:bg-red-600 hover:text-white text-red-600 rounded-xl transition-all duration-300 shadow-sm border border-red-200 hover:border-red-600"
                                                    whileTap={{ scale: 0.9 }}
                                                    title="Delete link"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

export default LinksTable;