'use client';

import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import Tabs from '@/components/Tabs';
import {
    faBrain, faSearch, faMapMarkedAlt, faMicroscope,
    faVrCardboard, faClock, faEye, faDownload, faShareAlt,
    faFileAlt, faCheckCircle, faFingerprint, faUserSecret, faSpinner, faCloudUploadAlt
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';
import { useState } from 'react';

const capabilities = [
    { icon: faSearch, title: 'Pattern Recognition', desc: 'AI identifies patterns in evidence data that may not be visible to human investigators.', stats: ['94% accuracy', '2.3s avg time'] },
    { icon: faMapMarkedAlt, title: 'Trajectory Analysis', desc: 'Calculate bullet trajectories and object movement paths based on evidence markers.', stats: ['89% accuracy', '1.5s avg time'] },
    { icon: faMicroscope, title: 'Evidence Correlation', desc: 'Automatically find connections between different pieces of evidence across cases.', stats: ['91% accuracy', '3.1s avg time'] },
    { icon: faVrCardboard, title: 'Scene Reconstruction', desc: 'Generate 3D crime scene models from photos and measurements using AI.', stats: ['87% accuracy', '5.2s avg time'] },
];

export default function ReconstructionPage() {
    const [matchType, setMatchType] = useState<'facial' | 'fingerprint'>('facial');
    const [isMatching, setIsMatching] = useState(false);
    const [matchResult, setMatchResult] = useState<string | null>(null);

    const runMatch = () => {
        setIsMatching(true);
        setMatchResult(null);
        setTimeout(() => {
            setIsMatching(false);
            setMatchResult(matchType === 'facial' ? 'Match Found: Subject ID #892-A (98.4%)' : 'Match Found: AFIS Record #F-9923 (99.9%)');
        }, 3000);
    };

    return (
        <PageLoader type="reconstruction">
        <div className={styles.reconstruction} role="main" aria-label="AI analysis page">
            <div className="container">
                <h1>AI Analysis</h1>
                <p>Machine learning-powered forensic analysis and reconstruction</p>

                <div className={styles.analysisControls}>
                    <h2>Run Analysis</h2>
                    <div className={styles.analysisForm}>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 500, color: 'var(--text-primary)' }}>
                                    <FAIcon icon={faFileAlt} style={{ color: 'var(--primary-blue)' }} /> Case Reference
                                </label>
                                <select style={{ width: '100%', padding: '12px 16px', background: '#161b2a', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }}>
                                    <option value="" style={{ background: '#121826', color: '#ffffff' }}>Select Case</option>
                                    <option style={{ background: '#121826', color: '#ffffff' }}>CS-2024-001 - Downtown Burglary</option>
                                    <option style={{ background: '#121826', color: '#ffffff' }}>CS-2024-002 - Vehicle Theft</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 500, color: 'var(--text-primary)' }}>
                                    <FAIcon icon={faBrain} style={{ color: 'var(--primary-blue)' }} /> Analysis Type
                                </label>
                                <select style={{ width: '100%', padding: '12px 16px', background: '#161b2a', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }}>
                                    <option value="" style={{ background: '#121826', color: '#ffffff' }}>Select Analysis</option>
                                    <option style={{ background: '#121826', color: '#ffffff' }}>Pattern Recognition</option>
                                    <option style={{ background: '#121826', color: '#ffffff' }}>Trajectory Analysis</option>
                                    <option style={{ background: '#121826', color: '#ffffff' }}>Evidence Correlation</option>
                                    <option style={{ background: '#121826', color: '#ffffff' }}>Full Reconstruction</option>
                                </select>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ marginTop: '10px' }}>
                            <FAIcon icon={faBrain} /> Run Analysis
                        </button>
                    </div>
                </div>

                <div className={styles.analysisResult}>
                    <div className={styles.resultHeader}>
                        <div>
                            <h3>Pattern Analysis - Downtown Burglary</h3>
                            <div className={styles.resultMeta}>
                                <span className={styles.caseBadge}>CS-2024-001</span>
                                <span className={styles.timestamp}><FAIcon icon={faClock} /> Jan 15, 2024 - 14:30</span>
                            </div>
                        </div>
                        <span className={`${styles.confidence} ${styles.confidenceHigh}`}>High Confidence (94%)</span>
                    </div>
                    <div className={styles.resultContent}>
                        <div className={styles.findings}>
                            <h4>Key Findings</h4>
                            <ul>
                                <li>Forced entry pattern matches 3 previous cases in the area</li>
                                <li>Suspect likely entered through rear door between 22:00-22:30</li>
                                <li>Tool marks consistent with crowbar usage</li>
                                <li>Time of incident correlates with witness statements</li>
                            </ul>
                        </div>
                        <div className={styles.recommendations}>
                            <h4>Recommendations</h4>
                            <ul>
                                <li>Cross-reference with cases CS-2023-089, CS-2023-092</li>
                                <li>Process surveillance footage from adjacent properties</li>
                                <li>Run fingerprint comparison against known suspects</li>
                                <li>Generate 3D reconstruction of entry point</li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.resultActions}>
                        <button className="btn btn-sm btn-primary"><FAIcon icon={faEye} /> View Full Report</button>
                        <button className="btn btn-sm btn-outline"><FAIcon icon={faDownload} /> Export PDF</button>
                        <button className="btn btn-sm btn-outline"><FAIcon icon={faShareAlt} /> Share with Team</button>
                    </div>
                </div>

                <div className="section" style={{ marginTop: '40px' }}>
                    <h2><FAIcon icon={faUserSecret} /> Biometric Match Simulator</h2>
                    <div className={styles.matchSimulator}>
                        <div className={styles.matchControls}>
                            <button 
                                className={`btn ${matchType === 'facial' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setMatchType('facial')}
                            >
                                <FAIcon icon={faUserSecret} /> Facial Recognition
                            </button>
                            <button 
                                className={`btn ${matchType === 'fingerprint' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setMatchType('fingerprint')}
                            >
                                <FAIcon icon={faFingerprint} /> Fingerprint AFIS
                            </button>
                        </div>
                        
                        <div className={styles.matchScreen}>
                            {isMatching ? (
                                <div className={styles.scanning}>
                                    <FAIcon icon={matchType === 'facial' ? faUserSecret : faFingerprint} className={styles.scanIcon} />
                                    <div className={styles.scanBar}></div>
                                    <p>Querying national database...</p>
                                </div>
                            ) : matchResult ? (
                                <div className={styles.matchFound}>
                                    <FAIcon icon={faCheckCircle} className={styles.successIcon} />
                                    <h3>{matchResult}</h3>
                                    <button className="btn btn-sm btn-outline" onClick={() => setMatchResult(null)}>Run New Scan</button>
                                </div>
                            ) : (
                                <div className={styles.matchIdle}>
                                    <FAIcon icon={faCloudUploadAlt} style={{ fontSize: '3rem', color: 'var(--text-muted)' }} />
                                    <p>Select evidence to run matching algorithm</p>
                                    <button className="btn btn-primary" onClick={runMatch}>Start Scan</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="section">
                    <Tabs
                        defaultTab="capabilities"
                        tabs={[
                            {
                                id: 'capabilities',
                                label: 'AI Capabilities',
                                content: (
                                    <div className={styles.capabilitiesGrid}>
                                        {capabilities.map((c, i) => (
                                            <div key={i} className={styles.capabilityCard}>
                                                <div className={styles.capabilityIcon}><FAIcon icon={c.icon} /></div>
                                                <h3>{c.title}</h3>
                                                <p>{c.desc}</p>
                                                <div className={styles.capabilityStats}>
                                                    {c.stats.map((s, j) => (
                                                        <span key={j}><FAIcon icon={faCheckCircle} style={{ color: 'var(--success)' }} /> {s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                            {
                                id: 'docs',
                                label: 'Documentation',
                                content: (
                                    <div style={{ padding: '10px 0' }}>
                                        <p style={{ marginBottom: '15px' }}>AI Analysis modules use state-of-the-art machine learning models trained on forensic datasets.</p>
                                        <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '2' }}>
                                            <li>Pattern Recognition - Convolutional Neural Networks</li>
                                            <li>Trajectory Analysis - Physics simulation + ML</li>
                                            <li>Evidence Correlation - Graph neural networks</li>
                                            <li>Scene Reconstruction - 3D CNN + point cloud processing</li>
                                        </ul>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
        </PageLoader>
    );
}
