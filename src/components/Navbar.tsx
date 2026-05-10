'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import FAIcon from './FontAwesome';
import ThemeToggle from './ThemeToggle';
import {
    faFingerprint, faHome, faTachometerAlt, faCloudUploadAlt,
    faClipboardList, faRobot, faVrCardboard, faUsers, faShieldAlt, faUser,
    faBars, faCog
} from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.css';

const navItems = [
    { href: '/', label: 'Home', icon: faHome },
    { href: '/dashboard', label: 'Dashboard', icon: faTachometerAlt },
    { href: '/upload', label: 'Upload', icon: faCloudUploadAlt },
    { href: '/evidence', label: 'Evidence', icon: faClipboardList },
    { href: '/reconstruction', label: 'AI Analysis', icon: faRobot },
    { href: '/visualization', label: 'Visualization', icon: faVrCardboard },
    { href: '/collaboration', label: 'Collaboration', icon: faUsers },
    { href: '/security', label: 'Security', icon: faShieldAlt },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
            <div className={styles.navContainer}>
                <Link href="/" className={styles.navBrand} aria-label="ForensicRecon home">
                    <FAIcon icon={faFingerprint} />
                    <span>Forensic<span className={styles.highlight}>Recon</span></span>
                </Link>
                <ul className={`${styles.navMenu} ${mobileMenuOpen ? styles.open : ''}`} role="menubar">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={pathname === item.href ? styles.active : ''}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FAIcon icon={item.icon} /> <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className={styles.navRight}>
                    <ThemeToggle />
                    <div className={styles.navUser}>
                        <div className={styles.userAvatar}>
                            <FAIcon icon={faUser} />
                        </div>
                    </div>
                </div>
                <button 
                    className={styles.mobileMenuBtn}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <FAIcon icon={faBars} />
                </button>
            </div>
        </nav>
    );
}
