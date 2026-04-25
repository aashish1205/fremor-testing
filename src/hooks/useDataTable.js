import { useState, useMemo } from 'react';

export const useDataTable = (data, searchKeys, itemsPerPage = 10) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = useMemo(() => {
        if (!searchTerm) return data || [];
        return (data || []).filter(item => 
            searchKeys.some(key => {
                const val = item[key];
                return val !== undefined && val !== null && val.toString().toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [data, searchTerm, searchKeys]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    // Ensure currentPage is valid if data shrinks
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    return {
        searchTerm,
        handleSearch,
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedData,
        totalItems: filteredData.length
    };
};
