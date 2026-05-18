import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

// Mock Data
const revenueData = [
    { name: 'Jan', revenue: 4000, bookings: 24 },
    { name: 'Feb', revenue: 3000, bookings: 13 },
    { name: 'Mar', revenue: 5000, bookings: 38 },
    { name: 'Apr', revenue: 7000, bookings: 43 },
    { name: 'May', revenue: 6000, bookings: 35 },
    { name: 'Jun', revenue: 9000, bookings: 55 },
    { name: 'Jul', revenue: 11000, bookings: 68 },
];

const packageData = [
    { name: 'Destinations', value: 45 },
    { name: 'Cruises', value: 25 },
    { name: 'Tours', value: 30 },
];
const COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

const destinationStats = [
    { name: 'Bali', visits: 400 },
    { name: 'Maldives', visits: 350 },
    { name: 'Paris', visits: 300 },
    { name: 'Dubai', visits: 200 },
    { name: 'Switzerland', visits: 150 },
];

const DashboardAdmin = () => {

    const [startDate, setStartDate] = useState(new Date());

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                        Dashboard Overview
                    </h2>
                    <p style={{ color: '#64748b', margin: 0 }}>Welcome back, here's what's happening with your travels today.</p>
                </div>
                <div>
                     <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: '500', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>
                        <i className="fa-solid fa-download me-2"></i> Export Report
                     </button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="row g-4 mb-4">
                {[
                    { title: "Total Bookings", value: "1,245", icon: "fa-ticket", color: "#3b82f6", trend: "+12.5%" },
                    { title: "Total Revenue", value: "₹45,23,000", icon: "fa-indian-rupee-sign", color: "#10b981", trend: "+8.2%" },
                    { title: "Active Trips", value: "86", icon: "fa-plane-departure", color: "#f59e0b", trend: "+2.4%" },
                    { title: "Total Users", value: "3,892", icon: "fa-users", color: "#8b5cf6", trend: "+15.3%" },
                ].map((stat, i) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={i}>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>{stat.title}</p>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{stat.value}</h3>
                                </div>
                                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                    <i className={`fa-solid ${stat.icon}`}></i>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                                <span style={{ color: '#10b981', fontWeight: '600', background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '20px' }}><i className="fa-solid fa-arrow-trend-up me-1"></i>{stat.trend}</span>
                                <span style={{ color: '#94a3b8' }}>vs last month</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 mb-4">
                {/* Main Graph */}
                <div className="col-lg-8">
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '100%' }}>
                        <h5 style={{ fontWeight: '600', marginBottom: '1.5rem', color: '#0f172a' }}>Revenue Overview</h5>
                        <div style={{ width: '100%', height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="col-lg-4">
                     <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '100%' }}>
                        <h5 style={{ fontWeight: '600', marginBottom: '1.5rem', color: '#0f172a' }}>Bookings by Category</h5>
                        <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={packageData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {packageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Bar Chart */}
                <div className="col-lg-7">
                     <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '100%' }}>
                        <h5 style={{ fontWeight: '600', marginBottom: '1.5rem', color: '#0f172a' }}>Top Destinations Visited</h5>
                        <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={destinationStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="visits" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Calendar / Schedule Widget */}
                <div className="col-lg-5">
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '100%' }}>
                         <h5 style={{ fontWeight: '600', marginBottom: '1.5rem', color: '#0f172a' }}>Schedule Calendar</h5>
                         <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <style>{`
                                .react-datepicker { font-family: inherit; border: none; width: 100%; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-radius: 12px; }
                                .react-datepicker__month-container { width: 100%; }
                                .react-datepicker__header { background-color: white; border-bottom: 1px solid #f1f5f9; padding-top: 15px; }
                                .react-datepicker__current-month { color: #0f172a; font-weight: 700; font-size: 1.1rem; }
                                .react-datepicker__day-name { color: #94a3b8; font-weight: 600; width: 35px; margin: 0.2rem; }
                                .react-datepicker__day { color: #475569; width: 35px; margin: 0.2rem; border-radius: 8px; line-height: 35px; font-weight: 500;}
                                .react-datepicker__day:hover { background-color: #f1f5f9; }
                                .react-datepicker__day--selected { background-color: #3b82f6 !important; color: white !important; font-weight: 600; }
                                .react-datepicker__day--keyboard-selected { background-color: #eff6ff; color: #3b82f6;}
                            `}</style>
                            <DatePicker 
                                selected={startDate} 
                                onChange={(date) => setStartDate(date)} 
                                inline
                            />
                         </div>
                         <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                             <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '0.5rem' }}>UPCOMING DEPARTURES</div>
                             <div className="d-flex align-items-center mb-2">
                                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                                <div style={{ flex: 1, fontSize: '0.9rem', color: '#0f172a', fontWeight: '500' }}>Maldives Premium</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Today, 04:00 PM</div>
                             </div>
                             <div className="d-flex align-items-center">
                                <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', marginRight: '10px' }}></div>
                                <div style={{ flex: 1, fontSize: '0.9rem', color: '#0f172a', fontWeight: '500' }}>Bali Cultural Tour</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Tmw, 09:30 AM</div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardAdmin;
