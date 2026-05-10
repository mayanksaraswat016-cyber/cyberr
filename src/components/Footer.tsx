'use client';

import Link from 'next/link';
import FAIcon from './FontAwesome';
import { faFingerprint, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerContent}>
                    <div className={styles.footerBrand}>
                        <FAIcon icon={faFingerprint} />
                        <span>Forensic<span className={styles.highlight}>Recon</span></span>
                        <p className={styles.footerTagline}>Advanced Crime Scene Reconstruction System</p>
                    </div>
                    <div className={styles.footerLinks}>
                        <div className={styles.footerSection}>
                            <h4>System</h4>
                            <Link href="/dashboard">Dashboard</Link>
                            <Link href="/upload">Upload Case</Link>
                            <Link href="/evidence">Evidence Management</Link>
                            <Link href="/reconstruction">AI Analysis</Link>
                        </div>
                        <div className={styles.footerSection}>
                            <h4>Resources</h4>
                            <Link href="/security">Security &amp; Ethics</Link>
                            <Link href="#">Documentation</Link>
                            <Link href="#">Training</Link>
                            <Link href="#">Support</Link>
                        </div>
                        <div className={styles.footerSection}>
                            <h4>Legal</h4>
                            <Link href="#">Privacy Policy</Link>
                            <Link href="#">Terms of Service</Link>
                            <Link href="#">Compliance</Link>
                            <Link href="#">Audit Logs</Link>
                        </div>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>&copy; 2024 ForensicRecon System. For authorized law enforcement use only.</p>
                    <div className={styles.footerSecurity}>
                        <FAIcon icon={faShieldAlt} />
                        <span>Secure Connection Encrypted</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
