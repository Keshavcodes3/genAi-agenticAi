import React, { useEffect, useState } from 'react';
import { createServiceClient } from '../../../config/apiClient.js';
import { motion } from 'framer-motion';
import { Users, BookOpen, PenTool, Flame, ShieldAlert, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStories: 0,
        totalPoems: 0,
        totalStreaks: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const authApi = createServiceClient('/auth');
                const response = await authApi.get('/admin/stats');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch admin statistics');
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'admin') {
            fetchStats();
        } else {
            setLoading(false);
            setError('Access Denied. You do not have admin privileges.');
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full text-zinc-600">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-zinc-800 mb-2">Access Denied</h2>
                <p>{error}</p>
            </div>
        );
    }

    const contentData = [
        { name: 'Stories', value: stats.totalStories, color: '#8B5CF6' },
        { name: 'Poems', value: stats.totalPoems, color: '#EC4899' }
    ];

    const engagementData = [
        { name: 'Users', total: stats.totalUsers },
        { name: 'Total Streaks', total: stats.totalStreaks }
    ];

    const StatCard = ({ title, value, icon: Icon, color, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 flex items-center justify-between"
        >
            <div>
                <p className="text-sm font-medium text-zinc-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-zinc-900">{value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFE] p-8 max-w-7xl mx-auto w-full">
            <div className="mb-8 flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                    <ShieldAlert className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
                    <p className="text-zinc-500 text-sm">System metrics and platform overview</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" delay={0.1} />
                <StatCard title="Stories Written" value={stats.totalStories} icon={BookOpen} color="bg-violet-500" delay={0.2} />
                <StatCard title="Poems Written" value={stats.totalPoems} icon={PenTool} color="bg-pink-500" delay={0.3} />
                <StatCard title="Total Streaks" value={stats.totalStreaks} icon={Flame} color="bg-orange-500" delay={0.4} />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Content Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100"
                >
                    <h3 className="text-lg font-bold text-zinc-900 mb-6">Content Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={contentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {contentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {contentData.map(item => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm font-medium text-zinc-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Engagement Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100"
                >
                    <h3 className="text-lg font-bold text-zinc-900 mb-6">Engagement Overview</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={engagementData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 14 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="total" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
