'use client';

import { useState } from 'react';
import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import Lightbox from '@/components/Lightbox';
import Link from 'next/link';
import {
    faFileAlt, faCalendarAlt, faMapMarkerAlt, faUser,
    faCamera, faVideo, faFileImage, faEye, faDownload,
    faShareAlt, faShieldAlt, faCheckCircle, faClock, faLink, faTimes
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

const custodyHistory = [
    { date: 'Jan 15, 2024 14:30', action: 'Collected', user: 'Det. Miller', notes: 'Collected at crime scene' },
    { date: 'Jan 15, 2024 16:45', action: 'Logged', user: 'Tech. Rodriguez', notes: 'Entered into evidence locker A4' },
    { date: 'Jan 16, 2024 09:15', action: 'Analyzed', user: 'Dr. Patel', notes: 'Checked out for lab analysis' },
    { date: 'Jan 16, 2024 15:30', action: 'Returned', user: 'Dr. Patel', notes: 'Returned to evidence locker' }
];

const evidenceItems = [
    { id: 'EV-001', title: 'Crime Scene Photo - Entry Point', type: 'typeImage', typeText: 'Image', typeIcon: faCamera, status: 'statusAnalyzed', statusText: 'Analyzed', date: 'Jan 15, 2024', caseRef: 'CS-2024-001', collector: 'Det. Miller', notes: 'High-resolution photo showing forced entry through back door.', tags: ['Urgent', 'Reviewed'], imageSrc: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&q=80&w=1000' },
    { id: 'EV-002', title: 'Surveillance Footage - Parking Lot', type: 'typeVideo', typeText: 'Video', typeIcon: faVideo, status: 'statusProcessing', statusText: 'Processing', date: 'Jan 15, 2024', caseRef: 'CS-2024-001', collector: 'Officer Chen', notes: 'CCTV footage from adjacent parking lot. Suspect vehicle visible at timestamp 22:15.', tags: ['Pending'], imageSrc: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 'EV-003', title: 'Forensic Report - Blood Analysis', type: 'typeDocument', typeText: 'Document', typeIcon: faFileImage, status: 'statusUploaded', statusText: 'Uploaded', date: 'Jan 16, 2024', caseRef: 'CS-2024-001', collector: 'Dr. Patel', notes: 'Preliminary blood spatter analysis indicating struggle near the entrance.', tags: ['Reviewed'], imageSrc: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'EV-004', title: 'Fingerprint Analysis Report', type: 'typeDocument', typeText: 'Document', typeIcon: faFileImage, status: 'statusAnalyzed', statusText: 'Analyzed', date: 'Jan 14, 2024', caseRef: 'CS-2024-002', collector: 'Tech. Rodriguez', notes: 'Latent prints recovered from vehicle door handle. 3 matches found in AFIS database.', tags: ['Urgent'], imageSrc: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
];

export default function EvidencePage() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentMedia, setCurrentMedia] = useState<{ src: string, alt: string, type: 'image' | 'video' | 'document' }>({ src: '', alt: '', type: 'image' });
    const [custodyItem, setCustodyItem] = useState<string | null>(null);

    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCase, setFilterCase] = useState('');

    const exportToCSV = () => {
        const headers = ['ID', 'Title', 'Type', 'Status', 'Date', 'Case Ref', 'Collector', 'Notes', 'Tags'];
        const rows = evidenceItems.map(item => [
            item.id,
            `"${item.title.replace(/"/g, '""')}"`,
            item.typeText,
            item.statusText,
            `"${item.date}"`,
            item.caseRef,
            `"${item.collector}"`,
            `"${item.notes.replace(/"/g, '""')}"`,
            `"${(item.tags || []).join(', ')}"`
        ]);
        
        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'evidence_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openLightbox = (src: string, alt: string, itemType: string) => {
        let mediaType: 'image' | 'video' | 'document' = 'image';
        if (itemType === 'typeVideo') mediaType = 'video';
        if (itemType === 'typeDocument') mediaType = 'document';
        
        setCurrentMedia({ src, alt, type: mediaType });
        setLightboxOpen(true);
    };

    const filteredEvidence = evidenceItems.filter(e => {
        if (filterType && e.typeText !== filterType) return false;
        if (filterStatus && e.statusText !== filterStatus) return false;
        if (filterCase && e.caseRef !== filterCase) return false;
        return true;
    });

    return (
        <PageLoader type="evidence">
        <div className={styles.evidence} role="main" aria-label="Evidence management page">
            <div className="container">
                <h1>Evidence Management</h1>
                <p>Digital evidence catalog with chain of custody tracking</p>

                <div className={styles.evidenceFilters}>
                    <div className={styles.filterGroup}>
                        <label>Evidence Type</label>
                        <select className={styles.filterSelect} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                            <option value="" style={{ background: '#121826', color: '#ffffff' }}>All Types</option>
                            <option value="Image" style={{ background: '#121826', color: '#ffffff' }}>Images</option>
                            <option value="Video" style={{ background: '#121826', color: '#ffffff' }}>Videos</option>
                            <option value="Document" style={{ background: '#121826', color: '#ffffff' }}>Documents</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Status</label>
                        <select className={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="" style={{ background: '#121826', color: '#ffffff' }}>All Status</option>
                            <option value="Uploaded" style={{ background: '#121826', color: '#ffffff' }}>Uploaded</option>
                            <option value="Processing" style={{ background: '#121826', color: '#ffffff' }}>Processing</option>
                            <option value="Analyzed" style={{ background: '#121826', color: '#ffffff' }}>Analyzed</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Case Reference</label>
                        <select className={styles.filterSelect} value={filterCase} onChange={(e) => setFilterCase(e.target.value)}>
                            <option value="" style={{ background: '#121826', color: '#ffffff' }}>All Cases</option>
                            <option value="CS-2024-001" style={{ background: '#121826', color: '#ffffff' }}>CS-2024-001</option>
                            <option value="CS-2024-002" style={{ background: '#121826', color: '#ffffff' }}>CS-2024-002</option>
                        </select>
                    </div>
                </div>

                <div className={styles.evidenceTableContainer}>
                    <table className={styles.evidenceTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Case</th>
                                <th>Collector</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvidence.length > 0 ? filteredEvidence.map((e, i) => (
                                <tr key={i}>
                                    <td><span className={styles.evidenceBadge}>{e.id}</span></td>
                                    <td>
                                        <div className={styles.evidenceTitle}>{e.title}</div>
                                        <div className={styles.tagContainer}>
                                            {e.tags?.map((tag, idx) => (
                                                <span key={idx} className={`${styles.evidenceTag} ${styles[`tag${tag}`]}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className={styles.evidenceNotes} style={{ marginTop: '10px' }}>{e.notes}</div>
                                    </td>
                                    <td>
                                        <span className={`${styles.evidenceType} ${styles[e.type]}`}>
                                            <FAIcon icon={e.typeIcon} /> {e.typeText}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.evidenceStatus} ${styles[e.status]}`}>{e.statusText}</span>
                                    </td>
                                    <td><FAIcon icon={faCalendarAlt} style={{ color: 'var(--primary-blue)', marginRight: '5px' }} /> {e.date}</td>
                                    <td><FAIcon icon={faFileAlt} style={{ color: 'var(--primary-blue)', marginRight: '5px' }} /> {e.caseRef}</td>
                                    <td><FAIcon icon={faUser} style={{ color: 'var(--primary-blue)', marginRight: '5px' }} /> {e.collector}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button 
                                                className="btn btn-sm btn-primary"
                                                onClick={() => openLightbox(e.imageSrc || '', e.title, e.type)}
                                                title="View Media"
                                            >
                                                <FAIcon icon={faEye} />
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline"
                                                onClick={() => setCustodyItem(e.id)}
                                                title="Chain of Custody"
                                            >
                                                <FAIcon icon={faLink} />
                                            </button>
                                            <button className="btn btn-sm btn-outline"><FAIcon icon={faDownload} /></button>
                                            <button className="btn btn-sm btn-outline"><FAIcon icon={faShareAlt} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                        No evidence matches the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="section">
                    <h2>Evidence Statistics</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <h3>Total Evidence</h3>
                            <div className={styles.statNumber}>1,847</div>
                            <div className={styles.statBreakdown}>
                                <span><FAIcon icon={faCamera} style={{ color: 'var(--primary-blue)' }} /> Images: 1,204</span>
                                <span><FAIcon icon={faVideo} style={{ color: 'var(--warning)' }} /> Videos: 342</span>
                                <span><FAIcon icon={faFileImage} style={{ color: 'var(--success)' }} /> Documents: 301</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Processing Status</h3>
                            <div className={styles.statNumber}>78%</div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '78%' }}></div>
                            </div>
                            <div className={styles.statBreakdown}>
                                <span><FAIcon icon={faCheckCircle} style={{ color: 'var(--success)' }} /> Analyzed: 1,440</span>
                                <span><FAIcon icon={faClock} style={{ color: 'var(--primary-blue)' }} /> Processing: 213</span>
                                <span><FAIcon icon={faClock} style={{ color: 'var(--warning)' }} /> Pending: 194</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Security Status</h3>
                            <div className={styles.statNumber}>100%</div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '100%' }}></div>
                            </div>
                            <div className={styles.statSecurity}>
                                <FAIcon icon={faShieldAlt} /> All evidence encrypted & verified
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {custodyItem && (
                <div className={styles.custodyModal}>
                    <div className={styles.custodyContent}>
                        <div className={styles.custodyHeader}>
                            <h3><FAIcon icon={faLink} /> Chain of Custody: {custodyItem}</h3>
                            <button className={styles.closeBtn} onClick={() => setCustodyItem(null)}><FAIcon icon={faTimes} /></button>
                        </div>
                        <div className={styles.timeline}>
                            {custodyHistory.map((h, i) => (
                                <div key={i} className={styles.timelineItem}>
                                    <div className={styles.timelineDot} />
                                    <div className={styles.timelineContent}>
                                        <div className={styles.timelineTime}>{h.date}</div>
                                        <div className={styles.timelineAction}>{h.action}</div>
                                        <div className={styles.timelineUser}><FAIcon icon={faUser} /> {h.user}</div>
                                        <div className={styles.timelineNotes}>{h.notes}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Lightbox 
                isOpen={lightboxOpen} 
                onClose={() => setLightboxOpen(false)} 
                src={currentMedia.src} 
                alt={currentMedia.alt}
                type={currentMedia.type}
            />
        </div>
        </PageLoader>
    );
}
