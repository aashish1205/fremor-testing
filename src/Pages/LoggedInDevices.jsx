import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import MyAccountHeader from '../Components/MyAccountHeader';
import MyAccountSidebar from '../Components/MyAccountSidebar';

const LoggedInDevices = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        fetchUser();
    }, []);

    return (
        <div style={{ background: '#f4f5f6', minHeight: '100vh', paddingBottom: '60px' }}>
            <MyAccountHeader title="My Account" user={user} />
            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row g-0" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div className="col-md-3">
                        <MyAccountSidebar />
                    </div>
                    <div className="col-md-9" style={{ padding: '32px 40px' }}>
                        <h4 style={{ fontWeight: 700, marginBottom: '24px', fontSize: '22px' }}>Logged In Devices</h4>
                        <div style={{ padding: '24px', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <i className="fa-solid fa-laptop" style={{ fontSize: '24px', color: '#555' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#333' }}>Current Device</div>
                                    <div style={{ fontSize: '13px', color: '#888' }}>Active now</div>
                                </div>
                            </div>
                            <div style={{ color: '#20c997', fontWeight: 600, fontSize: '13px' }}>
                                <i className="fa-solid fa-check-circle me-1" /> This Device
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoggedInDevices;
