import { useState, useMemo, useEffect } from 'react';

export const useDataTable = (data, searchKeys, itemsPerPage = 10, externalSearchTerm = null, setExternalSearchTerm = null) => {
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const activeSearchTerm = externalSearchTerm !== null ? externalSearchTerm : localSearchTerm;

    const filteredData = useMemo(() => {
        if (!activeSearchTerm) return data || [];
        return (data || []).filter(item => 
            searchKeys.some(key => {
                const val = item[key];
                return val !== undefined && val !== null && val.toString().toLowerCase().includes(activeSearchTerm.toLowerCase());
            })
        );
    }, [data, activeSearchTerm, searchKeys]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    // Ensure currentPage is valid if data shrinks
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    // Reset to page 1 on any search change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeSearchTerm]);

    const handleSearch = (e) => {
        const val = e.target.value;
        if (setExternalSearchTerm) {
            setExternalSearchTerm(val);
        } else {
            setLocalSearchTerm(val);
        }
    };

    return {
        searchTerm: activeSearchTerm,
        handleSearch,
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedData,
        totalItems: filteredData.length
    };
};
