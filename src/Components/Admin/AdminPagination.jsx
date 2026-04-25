import React from 'react';

export default function AdminPagination({ currentPage, totalPages, onPageChange, totalItems }) {
    if (totalPages <= 1 && totalItems === 0) return null;

    // Create a range of page numbers to show (max 5 visible at a time to prevent overflowing)
    const getPageNumbers = () => {
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + 4);
        
        if (end - start < 4) {
            start = Math.max(1, end - 4);
        }
        
        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <span className="text-muted small" style={{ fontWeight: '500' }}>
                Showing page <strong className="text-dark">{currentPage}</strong> of <strong className="text-dark">{totalPages}</strong> 
                {totalItems > 0 && ` (${totalItems} total items)`}
            </span>
            
            {totalPages > 1 && (
                <div className="d-flex gap-1" style={{ background: '#f8fafc', padding: '0.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <button 
                        className="btn btn-sm" 
                        style={{ background: currentPage === 1 ? 'transparent' : 'white', color: currentPage === 1 ? '#cbd5e1' : '#475569', border: 'none', boxShadow: currentPage === 1 ? 'none' : '0 1px 2px rgba(0,0,0,0.05)' }}
                        disabled={currentPage === 1} 
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    
                    {getPageNumbers().map(num => (
                        <button 
                            key={num} 
                            className="btn btn-sm"
                            style={{ 
                                background: currentPage === num ? '#2563eb' : 'transparent', 
                                color: currentPage === num ? 'white' : '#475569',
                                fontWeight: currentPage === num ? '600' : '500',
                                border: 'none',
                                minWidth: '32px',
                                borderRadius: '6px'
                            }}
                            onClick={() => onPageChange(num)}
                        >
                            {num}
                        </button>
                    ))}
                    
                    <button 
                        className="btn btn-sm" 
                        style={{ background: currentPage === totalPages ? 'transparent' : 'white', color: currentPage === totalPages ? '#cbd5e1' : '#475569', border: 'none', boxShadow: currentPage === totalPages ? 'none' : '0 1px 2px rgba(0,0,0,0.05)' }}
                        disabled={currentPage === totalPages} 
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
}
