'use client';

import { useState, useEffect, useCallback } from 'react';

import FAIcon from './FontAwesome';
import { faClock, faExclamationTriangle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const TIMEOUT_DURATION = 1800000; // 30 minutes (was 1 min for demo)
const WARNING_DURATION = 15000; // 15 seconds warning

export default function SessionTimeout() {
    const [isWarning, setIsWarning] = useState(false);
    const [countdown, setCountdown] = useState(WARNING_DURATION / 1000);
    const { playError, playClick } = useSoundEffects();

    const resetTimer = useCallback(() => {
        if (isWarning) return; // Don't reset if warning is already showing
        
        const lastActive = Date.now();
        localStorage.setItem('lastActive', lastActive.toString());
    }, [isWarning]);

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return;

        // Skip on login page
        if (window.location.pathname === '/login') return;

        resetTimer();

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(e => document.addEventListener(e, resetTimer));

        const interval = setInterval(() => {
            const lastActive = parseInt(localStorage.getItem('lastActive') || Date.now().toString());
            const now = Date.now();
            const inactiveTime = now - lastActive;

            if (inactiveTime > TIMEOUT_DURATION && !isWarning) {
                setIsWarning(true);
                playError();
            }
        }, 1000);

        return () => {
            events.forEach(e => document.removeEventListener(e, resetTimer));
            clearInterval(interval);
        };
    }, [resetTimer, isWarning, playError]);

    useEffect(() => {
        if (!isWarning) return;

        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    // Force logout
                    window.location.href = '/login';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [isWarning]);

    const handleStayLoggedIn = () => {
        playClick();
        setIsWarning(false);
        setCountdown(WARNING_DURATION / 1000);
        localStorage.setItem('lastActive', Date.now().toString());
    };

    if (!isWarning) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 999999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: 'var(--card-bg)', border: '1px solid var(--danger)',
                borderRadius: '16px', padding: '30px', maxWidth: '400px', width: '90%',
                textAlign: 'center', boxShadow: '0 20px 50px rgba(255, 82, 82, 0.2)'
            }}>
                <FAIcon icon={faExclamationTriangle} style={{ fontSize: '4rem', color: 'var(--danger)', marginBottom: '15px' }} />
                <h2 style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--text-primary)', marginBottom: '10px' }}>
                    Session Timeout Warning
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                    Your session is about to expire due to inactivity for security purposes.
                </p>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--danger)', marginBottom: '25px', fontFamily: 'var(--font-orbitron)' }}>
                    00:{countdown.toString().padStart(2, '0')}
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        className="btn btn-outline" 
                        onClick={() => window.location.href = '/login'}
                        style={{ flex: 1 }}
                    >
                        <FAIcon icon={faSignInAlt} /> Logout Now
                    </button>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleStayLoggedIn}
                        style={{ flex: 1, background: 'var(--danger)', borderColor: 'var(--danger)' }}
                    >
                        <FAIcon icon={faClock} /> Stay Logged In
                    </button>
                </div>
            </div>
        </div>
    );
}
