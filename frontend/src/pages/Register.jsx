import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { FiUserPlus, FiMail, FiLock, FiUser, FiShield, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';

const Register = () => {
    const { register, requestOtp } = useContext(AuthContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        otp: ''
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [infoMsg, setInfoMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const timerRef = useRef(null);

    const { username, email, password, otp } = formData;

    useEffect(() => {
        if (resendTimer > 0) {
            timerRef.current = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [resendTimer]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (!email || !username || !password) {
            setErrorMsg('Please fill in all details first');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');
        try {
            const msg = await requestOtp(email);
            setInfoMsg(msg);
            setStep(2);
            setResendTimer(60);
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || 'Failed to send verification code');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');
        try {
            await register(username, email, password, otp);
            navigate('/');
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px]"></div>

            <div className="dashboard-card w-full max-w-md p-8 md:p-10 space-y-8 relative z-10 transition-all duration-500">
                {/* Logo */}
                <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-lg mx-auto mb-4 logo-glow">
                        OS
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {step === 1 ? t('register.title') : t('register.verifyTitle')}
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm">
                        {step === 1 ? t('register.subtitle') : `${t('register.verifySubtitle')} ${email}`}
                    </p>
                </div>
                
                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm text-center animate-pulse">
                        {errorMsg}
                    </div>
                )}

                {infoMsg && !errorMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg text-sm text-center">
                        {infoMsg}
                    </div>
                )}
                
                {step === 1 ? (
                    <form className="space-y-5" onSubmit={handleSendOtp}>
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                                    <FiUser size={16} />
                                </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={username}
                                        onChange={onChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-[#0e0e16] border border-white/[0.06] rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 text-white placeholder-slate-600 transition-all outline-none text-sm"
                                        placeholder={t('register.username')}
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                                        <FiMail size={16} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={onChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-[#0e0e16] border border-white/[0.06] rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 text-white placeholder-slate-600 transition-all outline-none text-sm"
                                        placeholder={t('register.emailPlaceholder')}
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                                        <FiLock size={16} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        required
                                        minLength="6"
                                        className="w-full pl-10 pr-4 py-3 bg-[#0e0e16] border border-white/[0.06] rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 text-white placeholder-slate-600 transition-all outline-none text-sm"
                                        placeholder={t('register.passwordPlaceholder')}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <FiRefreshCw className="animate-spin" size={16} />
                                ) : (
                                    <FiMail size={16} />
                                )}
                                {t('register.sendOtp')}
                            </button>
                        </form>
                ) : (
                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                                    <FiShield size={16} />
                                </div>
                                <input
                                    type="text"
                                    name="otp"
                                    value={otp}
                                    onChange={onChange}
                                    required
                                    maxLength="6"
                                    className="w-full pl-10 pr-4 py-4 bg-[#0e0e16] border border-white/[0.06] rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 text-white placeholder-slate-600 transition-all outline-none text-center text-2xl font-bold tracking-[0.5em]"
                                    placeholder="000000"
                                />
                            </div>
                        </div>

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    {isSubmitting ? <FiRefreshCw className="animate-spin" size={16} /> : <FiUserPlus size={16} />}
                                    {t('register.completeBtn')}
                                </button>
                                
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        <FiArrowLeft size={12} /> {t('register.editDetails')}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={resendTimer > 0 || isSubmitting}
                                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 disabled:text-slate-700 transition-colors"
                                    >
                                        {resendTimer > 0 ? t('register.resendTimer', { time: resendTimer }) : t('register.resendCode')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    <p className="text-center text-sm text-slate-600">
                        {t('register.haveAccount')}{' '}
                        <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                            {t('register.loginHere')}
                        </Link>
                    </p>
            </div>
        </div>
    );
};

export default Register;

