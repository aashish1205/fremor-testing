import React, { createContext, useState, useContext } from 'react';

const AdminSearchContext = createContext();

export const AdminSearchProvider = ({ children }) => {
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');
    return (
        <AdminSearchContext.Provider value={{ globalSearchTerm, setGlobalSearchTerm }}>
            {children}
        </AdminSearchContext.Provider>
    );
};

export const useAdminSearch = () => useContext(AdminSearchContext);
