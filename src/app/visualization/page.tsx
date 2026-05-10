'use client';

import dynamic from 'next/dynamic';
import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import CrimeTimeline from '@/components/CrimeTimeline';
import {
    faVrCardboard, faCube, faLayerGroup, faExpand,
    faCompress, faSearch, faMapMarkedAlt, faCamera,
    faVideo, faClock, faPlayCircle, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

const CrimeScene3D = dynamic(() => import('@/components/CrimeScene3D'), { ssr: false });

export default function VisualizationPage() {
    return (
        <PageLoader type="visualization">
        <div className={styles.visualization} role="main" aria-label="Visualization page">
            <div className="container">
                <h1>3D Visualization</h1>
                <p>Immersive crime scene reconstruction and evidence mapping</p>

                <div className={styles.visualizationControls}>
                    <div className={styles.controlPanel}>
                        <div className={styles.controlGroup}>
                            <label>Select Case</label>
                            <select>
                                <option>CS-2024-001 - Downtown Burglary</option>
                                <option>CS-2024-002 - Vehicle Theft</option>
                            </select>
                        </div>
                        <div className={styles.controlGroup}>
                            <label>View Mode</label>
                            <div className={styles.viewButtons}>
                                <button className="btn btn-sm btn-outline active">3D</button>
                                <button className="btn btn-sm btn-outline">Top</button>
                                <button className="btn btn-sm btn-outline">Side</button>
                            </div>
                        </div>
                        <div className={styles.controlGroup}>
                            <label>Layers</label>
                            <div className={styles.layerControls}>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" defaultChecked /> Evidence Markers
                                </label>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" defaultChecked /> Trajectory Lines
                                </label>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" defaultChecked /> Room Outline
                                </label>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" /> Person Markers
                                </label>
                            </div>
                        </div>
                        <div className={styles.controlActions}>
                            <button className="btn btn-sm btn-outline"><FAIcon icon={faExpand} /> Fullscreen</button>
                            <button className="btn btn-sm btn-outline"><FAIcon icon={faCompress} /> Reset</button>
                        </div>
                    </div>

                    <div className={styles.visualizationPreview}>
                        <CrimeScene3D />
                    </div>
                </div>

                <div className={styles.sceneInfo}>
                    <div className={styles.infoCard}>
                        <h3>Scene Information</h3>
                        <div className={styles.infoDetails}>
                            <p><strong>Case:</strong> CS-2024-001</p>
                            <p><strong>Location:</strong> 123 Main St, Downtown</p>
                            <p><strong>Dimensions:</strong> 12m x 8m x 3m</p>
                            <p><strong>Evidence Items:</strong> 7 markers placed</p>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <h3>VR Capabilities</h3>
                        <div className={styles.vrCapabilities}>
                            <div className={styles.vrCard}>
                                <div className={styles.vrIcon}><FAIcon icon={faVrCardboard} /></div>
                                <h4>VR Walkthrough</h4>
                                <p>Immersive first-person navigation</p>
                            </div>
                            <div className={styles.vrCard}>
                                <div className={styles.vrIcon}><FAIcon icon={faCube} /></div>
                                <h4>3D Rotate</h4>
                                <p>Full 360° scene rotation</p>
                            </div>
                            <div className={styles.vrCard}>
                                <div className={styles.vrIcon}><FAIcon icon={faLayerGroup} /></div>
                                <h4>Layer Toggle</h4>
                                <p>Toggle evidence layers on/off</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <h2><FAIcon icon={faClock} /> Crime Event Timeline</h2>
                    <CrimeTimeline />
                </div>
            </div>
        </div>
        </PageLoader>
    );
}
