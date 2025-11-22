import { useState, useEffect } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import LinkForm from '../components/LinkForm';
import LinksTable from '../components/LinksTable';
import { createLink, getAllLinks, deleteLink } from '../api/links';

function Dashboard() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            setLoading(true);
            const response = await getAllLinks();
            setLinks(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching links:', err);
            setError('Failed to load links. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLinkCreated = async (originalUrl, customCode) => {
        const response = await createLink(originalUrl, customCode);
        await fetchLinks();
        return response;
    };

    const handleDelete = async (code) => {
        if (!window.confirm('Are you sure you want to delete this link?')) return;

        try {
            await deleteLink(code);
            setLinks(links.filter(link => link.code !== code));
            toast.success('Link deleted successfully!');
        } catch (err) {
            console.error('Error deleting link:', err);
            toast.error('Failed to delete link. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7F2E8] via-[#F0E7DB] to-[#E4D8C8] py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                {/* Header */}
                <motion.div
                    className="text-center mb-10 sm:mb-14"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <motion.div
                            className="p-3 sm:p-4 bg-gradient-to-br from-[#8B5E34] to-[#A47148] rounded-2xl sm:rounded-3xl shadow-xl"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <LinkIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#F7F2E8]" />
                        </motion.div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#3B3024] tracking-tight bg-gradient-to-r from-[#3B3024] to-[#8B5E34] bg-clip-text text-transparent">
                            TinyLink
                        </h1>
                    </div>
                    <p className="text-[#6C5E51] text-base sm:text-lg mb-4 sm:mb-6 font-medium px-4">
                        A premium miniature URL shortener — Make your links tiny & elegant.
                    </p>

                    {/* Animated Illustration */}
                    {/* <motion.img
                        src="https://www.tinylink.fr/images/images/og_image.png"
                        alt="TinyLink Illustration"
                        className="w-72 mx-auto mb-6 drop-shadow-xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    /> */}
                </motion.div>

                {/* Link Form */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <LinkForm onLinkCreated={handleLinkCreated} />
                </motion.div>

                {/* Links Table & States */}
                {loading ? (
                    <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-12 text-center border border-white/50">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#C9A887] border-t-[#8B5E34]"></div>
                        <p className="mt-4 text-[#6C5E51] font-medium text-lg">Loading links...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-10 text-center border border-white/50">
                        <p className="text-red-500 font-semibold">{error}</p>
                        <button
                            onClick={fetchLinks}
                            className="mt-5 px-6 py-3 bg-[#8B5E34] hover:bg-[#A47148] text-white font-semibold rounded-lg transition"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <LinksTable links={links} onDelete={handleDelete} />
                )}
            </motion.div>
        </div>
    );
}

export default Dashboard;