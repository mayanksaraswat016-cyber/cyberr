'use client';

import { useState } from 'react';
import FAIcon from '@/components/FontAwesome';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { faFingerprint, faLock, faUser, faEye, faEyeSlash, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

const roles = [
    { value: 'admin', label: 'Administrator', icon: faShieldAlt },
    { value: 'investigator', label: 'Lead Investigator', icon: faUser },
    { value: 'analyst', label: 'Forensic Analyst', icon: faFingerprint },
];

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useLocalStorage('forensic_role', 'investigator');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showBiometric, setShowBiometric] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { playSuccess, playError, playClick } = useSoundEffects();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            playError();
            setError('Please enter both username and password');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            if (step === 1) {
                if ((username === 'admin' && password === 'admin123') || (username && password.length >= 4)) {
                    playSuccess();
                    setStep(2);
                } else {
                    playError();
                    setError('Invalid credentials. Try any username with 4+ char password.');
                }
            } else {
                const otpValue = otp.join('');
                if (otpValue.length === 6) {
                    playSuccess();
                    window.location.href = '/dashboard';
                } else {
                    playError();
                    setError('Please enter the 6-digit verification code.');
                }
            }
            setLoading(false);
        }, 1500);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        playClick();

        // Auto-focus next input
        if (value !== '' && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleBiometricAuth = () => {
        playClick();
        setShowBiometric(true);
        setTimeout(() => {
            playSuccess();
            setStep(2); // Move to 2FA after fingerprint
            setShowBiometric(false);
        }, 2500);
    };

    return (
        <div className={styles.loginPage} role="main" aria-label="Login page">
            <div className={styles.loginBg}>
                <div className={styles.gridOverlay}></div>
                <div className={styles.floatingParticles}>
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className={styles.particle} style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}></div>
                    ))}
                </div>
            </div>

            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <div className={styles.logoIcon}>
                        <FAIcon icon={faFingerprint} />
                    </div>
                    <h1>Forensic<span className={styles.highlight}>Recon</span></h1>
                    <p>Smart Crime Scene Reconstruction System</p>
                    <div className={styles.securityBadge}>
                        <FAIcon icon={faLock} /> Secure Access Portal
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    {error && <div className={styles.errorMsg} role="alert">{error}</div>}

                    {step === 1 ? (
                        <>
                            <div className={styles.formGroup}>
                                <label htmlFor="username">Username</label>
                                <div className={styles.inputWrapper}>
                                    <FAIcon icon={faUser} className={styles.inputIcon} />
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        aria-label="Username"
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password">Password</label>
                                <div className={styles.inputWrapper}>
                                    <FAIcon icon={faLock} className={styles.inputIcon} />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        aria-label="Password"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => { setShowPassword(!showPassword); playClick(); }}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        <FAIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Access Level</label>
                                <div className={styles.roleSelector}>
                                    {roles.map((r) => (
                                        <button
                                            key={r.value}
                                            type="button"
                                            className={`${styles.roleBtn} ${role === r.value ? styles.roleActive : ''}`}
                                            onClick={() => { setRole(r.value); playClick(); }}
                                            aria-pressed={role === r.value}
                                        >
                                            <FAIcon icon={r.icon} />
                                            <span>{r.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.twoFactorStep}>
                            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                                <FAIcon icon={faShieldAlt} style={{ fontSize: '3rem', color: 'var(--primary-blue)', marginBottom: '10px' }} />
                                <h3>Two-Factor Authentication</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Enter the 6-digit code sent to your registered device.</p>
                            </div>
                            
                            <div className={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className={styles.otpInput}
                                        autoComplete="off"
                                    />
                                ))}
                            </div>
                            
                            <div className={styles.resendText}>
                                Didn't receive code? 
                                <button type="button" className={styles.resendLink} onClick={() => { playClick(); setError('New code sent to your device'); setTimeout(() => setError(''), 3000); }}>
                                    Resend
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.loginOptions}>
                        <button type="submit" className={styles.loginBtn} disabled={loading} style={{ flex: 2 }} aria-label={step === 1 ? "Sign in" : "Verify code"}>
                            {loading ? (
                                <span className={styles.spinner}></span>
                            ) : (
                                <>
                                    <FAIcon icon={faLock} /> {step === 1 ? "Sign In" : "Verify Code"}
                                </>
                            )}
                        </button>
                        {step === 1 && (
                            <button type="button" className={styles.bioBtn} onClick={handleBiometricAuth} aria-label="Use Biometric Login">
                                <FAIcon icon={faFingerprint} />
                            </button>
                        )}
                    </div>

                    <div className={styles.loginFooter}>
                        <p>For authorized law enforcement personnel only</p>
                        <p className={styles.hint}>Demo: any username + 4+ char password</p>
                    </div>
                </form>

                {showBiometric && (
                    <div className={styles.biometricOverlay}>
                        <div className={styles.fingerprintScanner}>
                            <FAIcon icon={faFingerprint} className={styles.fingerprintIcon} />
                            <div className={styles.scanLine}></div>
                        </div>
                        <div className={styles.biometricText}>Scanning Fingerprint...</div>
                        <button className={styles.cancelBiometric} onClick={() => setShowBiometric(false)}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
}
