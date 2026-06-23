"use client";
import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { z } from 'zod';

const phoneRegex = /^(\+998)\s(90|91|93|94|95|97|98|99|33|50|77|88)\s\d{3}\s\d{2}\s\d{2}$/;

const formSchema = z.object({
    name: z.string().min(2, { message: "Ism kamida 2 ta harfdan iborat bo'lishi kerak" }),
    mainPhone: z.string().regex(phoneRegex, { message: "Format: +998 90 123 45 67" }),
});

const CallbackModal = () => {
    const { closeModal } = useModal();
    const [name, setName] = useState('');
    const [mainPhone, setMainPhone] = useState('+998 ');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState(false);

    const formatPhoneNumber = (value: string) => {
        if (!value.startsWith('+998')) return '+998 ';
        const digits = value.replace(/\D/g, '').slice(3);
        let formatted = '+998 ';
        if (digits.length > 0) formatted += digits.slice(0, 2);
        if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
        if (digits.length > 5) formatted += ' ' + digits.slice(5, 7);
        if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);
        return formatted;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        setMainPhone(formattedValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        const validation = formSchema.safeParse({ name, mainPhone });

        if (!validation.success) {
            const formattedErrors: { [key: string]: string } = {};
            validation.error.issues.forEach((issue) => {
                if (issue.path[0]) formattedErrors[issue.path[0] as string] = issue.message;
            });
            setErrors(formattedErrors);
            return;
        }

        console.log("Yuborilgan ma'lumotlar:", validation.data);
        setSubmitted(true);
        setTimeout(() => {
            setName('');
            setMainPhone('+998 ');
            setSubmitted(false);
            closeModal();
        }, 2000);
    };

    return (
        <div className="callback-modal">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

                .callback-modal * {
                    font-family: 'Manrope', sans-serif;
                    box-sizing: border-box;
                }

                .modal-card {
                    background: #ffffff;
                    width: 95%;
                    max-width: 440px;
                    border-radius: 20px;
                    padding: 36px 32px 32px;
                    position: relative;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 24px 80px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.08);
                    animation: modalEnter 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    margin: 20px auto;
                }

                @keyframes modalEnter {
                    from { opacity: 0; transform: scale(0.88) translateY(20px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }

                .modal-card::-webkit-scrollbar { width: 4px; }
                .modal-card::-webkit-scrollbar-track { background: transparent; }
                .modal-card::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

                .close-btn {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s, transform 0.2s;
                    color: #64748b;
                }
                .close-btn:hover { background: #e2e8f0; transform: rotate(90deg); color: #1e293b; }

                .modal-icon {
                    width: 52px;
                    height: 52px;
                    background: linear-gradient(135deg, #1e6fd9 0%, #2d8cf0 100%);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                    box-shadow: 0 8px 20px rgba(30, 111, 217, 0.35);
                }
                .modal-title {
                    font-size: 22px;
                    font-weight: 800;
                    color: #0f172a;
                    text-align: center;
                    margin: 0 0 4px;
                    letter-spacing: -0.4px;
                }
                .modal-subtitle {
                    font-size: 13px;
                    color: #94a3b8;
                    text-align: center;
                    margin: 0 0 24px;
                    font-weight: 500;
                    line-height: 1.4;
                }

                .modal-divider {
                    height: 1px;
                    background: #f1f5f9;
                    margin: 0 -32px 24px;
                }

                .field-group { margin-bottom: 18px; }
                .field-label {
                    display: block;
                    font-size: 12px;
                    font-weight: 700;
                    color: #475569;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .field-required { color: #ef4444; margin-left: 2px; }

                .input-wrapper { position: relative; }
                .input-flag {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 18px;
                    pointer-events: none;
                    line-height: 1;
                }

                .form-input {
                    width: 100%;
                    padding: 12px 14px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 14.5px;
                    font-weight: 600;
                    color: #0f172a;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    background: #f8fafc;
                }
                .form-input::placeholder { color: #cbd5e1; font-weight: 500; }
                .form-input:focus {
                    border-color: #1e6fd9;
                    box-shadow: 0 0 0 3px rgba(30,111,217,0.12);
                    background: #ffffff;
                }
                .form-input.has-error { border-color: #ef4444; }
                .form-input.has-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
                .form-input.phone-input { padding-left: 40px; }

                .error-msg {
                    font-size: 11.5px;
                    color: #ef4444;
                    margin-top: 5px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .privacy-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 8px 0 4px;
                }
                .privacy-checkbox {
                    width: 16px;
                    height: 16px;
                    margin-top: 1px;
                    accent-color: #1e6fd9;
                    cursor: pointer;
                    flex-shrink: 0;
                }
                .privacy-label {
                    font-size: 12px;
                    color: #64748b;
                    line-height: 1.5;
                    cursor: pointer;
                    font-weight: 500;
                }
                .privacy-label a { color: #1e6fd9; text-decoration: none; }
                .privacy-label a:hover { text-decoration: underline; }

                .submit-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #1e6fd9 0%, #1a5fc4 100%);
                    color: #ffffff;
                    font-weight: 800;
                    font-size: 14px;
                    letter-spacing: 0.6px;
                    padding: 15px;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    margin-top: 20px;
                    text-transform: uppercase;
                    transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
                    box-shadow: 0 6px 20px rgba(30,111,217,0.38);
                }
                .submit-btn:hover {
                    background: linear-gradient(135deg, #1a5fc4 0%, #1650a8 100%);
                    box-shadow: 0 8px 28px rgba(30,111,217,0.45);
                    transform: translateY(-1px);
                }
                .submit-btn:active { transform: scale(0.98) translateY(0); }
                .submit-btn.success-state { background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 6px 20px rgba(16,185,129,0.38); }

                .success-icon {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                /* RESPONSIVE DIZAYN */
                @media (max-width: 480px) {
                    .modal-card {
                        padding: 28px 20px 24px;
                        width: 92%;
                        border-radius: 16px;
                    }
                    .modal-divider {
                        margin: 0 -20px 20px;
                    }
                    .modal-title {
                        font-size: 20px;
                    }
                    .modal-subtitle {
                        font-size: 12.5px;
                        margin-bottom: 20px;
                    }
                    .form-input {
                        padding: 11px 12px;
                        font-size: 14px;
                    }
                    .form-input.phone-input {
                        padding-left: 38px;
                    }
                    .submit-btn {
                        padding: 13px;
                        font-size: 13px;
                    }
                }
            `}</style>

            <div className="modal-card">
                {/* Close */}
                <button className="close-btn" onClick={closeModal} aria-label="Yopish">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Icon */}
                <div className="modal-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="white" />
                    </svg>
                </div>

                <h2 className="modal-title">Qayta qo'ng'iroq</h2>
                <p className="modal-subtitle">Ma'lumotlaringizni qoldiring, tez orada siz bilan bog'lanamiz</p>

                <div className="modal-divider" />

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="field-group">
                        <label className="field-label">
                            Ismingiz<span className="field-required">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ismingizni kiriting"
                            className={`form-input ${errors.name ? 'has-error' : ''}`}
                        />
                        {errors.name && (
                            <p className="error-msg">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <circle cx="6" cy="6" r="5.5" stroke="#ef4444" />
                                    <path d="M6 3.5V6.5M6 8.5V8.6" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Main Phone */}
                    <div className="field-group">
                        <label className="field-label">
                            Telefon raqamingiz<span className="field-required">*</span>
                        </label>
                        <div className="input-wrapper">
                            <span className="input-flag">🇺🇿</span>
                            <input
                                type="tel"
                                value={mainPhone}
                                onChange={handlePhoneChange}
                                maxLength={17}
                                placeholder="+998 90 123 45 67"
                                className={`form-input phone-input ${errors.mainPhone ? 'has-error' : ''}`}
                            />
                        </div>
                        {errors.mainPhone && (
                            <p className="error-msg">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <circle cx="6" cy="6" r="5.5" stroke="#ef4444" />
                                    <path d="M6 3.5V6.5M6 8.5V8.6" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                {errors.mainPhone}
                            </p>
                        )}
                    </div>

                    {/* Privacy */}
                    <div className="privacy-row">
                        <input type="checkbox" id="privacy" required className="privacy-checkbox" />
                        <label htmlFor="privacy" className="privacy-label">
                            <a href="/xafsizlik">Maxfiylik siyosati</a>ga muvofiq shaxsiy ma'lumotlarim qayta ishlanishiga roziman
                        </label>
                    </div>

                    {/* Submit */}
                    <button type="submit" className={`submit-btn ${submitted ? 'success-state' : ''}`}>
                        {submitted ? (
                            <span className="success-icon">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M3 9L7 13L15 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Muvaffaqiyatli yuborildi!
                            </span>
                        ) : (
                            "Menga qo'ng'iroq qiling"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CallbackModal;