import React from 'react';

export default function ConfirmModal({ 
    isOpen, 
    title = 'Confirm Action', 
    message = 'Are you sure you want to proceed?', 
    onConfirm, 
    onCancel, 
    confirmText = 'Delete', 
    cancelText = 'Cancel',
    type = 'danger' 
}) {
    if (!isOpen) return null;

    const isDanger = type === 'danger';

    return (
        <div className="confirm-modal-overlay" onClick={onCancel}>
            <style>{`
                .confirm-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(15, 23, 42, 0.65);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: confirmFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .confirm-modal-card {
                    background: #ffffff;
                    width: 90%;
                    max-width: 420px;
                    border-radius: 16px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                    padding: 28px 24px;
                    text-align: center;
                    animation: confirmScaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .confirm-modal-icon-container {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background-color: ${isDanger ? '#fee2e2' : '#fef3c7'};
                    color: ${isDanger ? '#ef4444' : '#d97706'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px auto;
                    font-size: 28px;
                }
                .confirm-modal-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 10px 0;
                    font-family: inherit;
                }
                .confirm-modal-message {
                    font-size: 14.5px;
                    color: #475569;
                    line-height: 1.55;
                    margin: 0 0 28px 0;
                    font-family: inherit;
                }
                .confirm-modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }
                .confirm-btn-cancel {
                    flex: 1;
                    padding: 11px 18px;
                    border-radius: 10px;
                    border: 1px solid #cbd5e1;
                    background: #ffffff;
                    color: #334155;
                    font-size: 14.5px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .confirm-btn-cancel:hover {
                    background: #f8fafc;
                    border-color: #94a3b8;
                    color: #0f172a;
                }
                .confirm-btn-action {
                    flex: 1;
                    padding: 11px 18px;
                    border-radius: 10px;
                    border: none;
                    background-color: ${isDanger ? '#ef4444' : '#f59e0b'};
                    color: #ffffff;
                    font-size: 14.5px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .confirm-btn-action:hover {
                    background-color: ${isDanger ? '#dc2626' : '#d97706'};
                    box-shadow: 0 4px 12px rgba(${isDanger ? '220, 38, 38' : '217, 119, 6'}, 0.25);
                }
                @keyframes confirmFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes confirmScaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
            
            <div className="confirm-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-modal-icon-container">
                    <i className={isDanger ? "fa-solid fa-triangle-exclamation" : "fa-solid fa-circle-question"}></i>
                </div>
                <h3 className="confirm-modal-title">{title}</h3>
                <p className="confirm-modal-message">{message}</p>
                <div className="confirm-modal-actions">
                    <button className="confirm-btn-cancel" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className="confirm-btn-action" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
