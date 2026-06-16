"use client";
import { useEffect } from "react";
import { useModal } from "../../context/ModalContext";
import CallbackModal from "../components/CallbackModal";

export default function CallbackModalWrapper() {
    const { isOpen, closeModal } = useModal();

    // ✅ Navbar highlight muammosini hal qilish:
    // body.paddingRight ishlatmaslik — u navbar reflow + highlight qiladi.
    // documentElement.overflow = hidden ishlatamiz, scrollbar kengligi CSS var orqali saqlanadi.
    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.documentElement.style.setProperty('--modal-scrollbar-w', `${scrollbarWidth}px`);
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
            document.documentElement.style.removeProperty('--modal-scrollbar-w');
        }
        return () => {
            document.documentElement.style.overflow = '';
            document.documentElement.style.removeProperty('--modal-scrollbar-w');
        };
    }, [isOpen]);

    // Escape tugmasi bilan yopish
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) closeModal();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeModal]);

    if (!isOpen) return null;

    return (
        <>
            <style>{`
                @keyframes overlayFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            `}</style>

            {/* Overlay — scrollbar kengligini ham qoplaydi, layout siljimaydi */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    /* right: scrollbar kengligini o'z ichiga oladi */
                    right: 'calc(-1 * var(--modal-scrollbar-w, 0px))',
                    bottom: 0,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(15, 23, 42, 0.55)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    animation: 'overlayFadeIn 0.2s ease forwards',
                }}
            >
                {/* Fon bosilganda yopish */}
                <div
                    onClick={closeModal}
                    style={{ position: 'absolute', inset: 0 }}
                />

                {/* Modal kontenti */}
                <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <CallbackModal />
                </div>
            </div>
        </>
    );
}