'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import FAIcon from '@/components/FontAwesome';
import {
    faPlayCircle, faUpload, faMapMarkedAlt, faMicroscope, faBrain,
    faVrCardboard, faUsersCog, faShieldAlt, faArrowRight,
    faRobot, faCube, faSearch
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

const features = [
    { icon: faMapMarkedAlt, title: 'Crime Scene Mapping', desc: 'Digitally reconstruct crime scenes with precise measurements and spatial data integration.', link: '/visualization', linkText: 'Explore' },
    { icon: faMicroscope, title: 'Evidence Digitization', desc: 'Upload, catalog, and manage digital evidence with secure chain of custody tracking.', link: '/evidence', linkText: 'Manage' },
    { icon: faBrain, title: 'AI-Assisted Analysis', desc: 'Pattern recognition, trajectory calculation, and evidence correlation using machine learning.', link: '/reconstruction', linkText: 'Analyze' },
    { icon: faVrCardboard, title: '3D/VR Visualization', desc: 'Immersive crime scene walkthroughs and evidence examination in virtual reality.', link: '/visualization', linkText: 'Visualize' },
    { icon: faUsersCog, title: 'Collaborative Workflow', desc: 'Multi-user investigation platform with role-based access and real-time updates.', link: '/collaboration', linkText: 'Collaborate' },
    { icon: faShieldAlt, title: 'Secure & Ethical', desc: 'Military-grade encryption, audit trails, and ethical AI guidelines compliance.', link: '/security', linkText: 'Secure' },
];

const workflowSteps = [
    { num: '1', title: 'Data Collection', desc: 'Gather evidence from crime scene including photos, videos, and physical evidence.' },
    { num: '2', title: 'Evidence Digitization', desc: 'Upload and catalog digital evidence with metadata and chain of custody.' },
    { num: '3', title: 'AI Processing', desc: 'Analyze patterns, reconstruct events, and generate insights using AI algorithms.' },
    { num: '4', title: '3D Visualization', desc: 'Create immersive reconstructions for analysis and presentation.' },
    { num: '5', title: 'Collaborative Review', desc: 'Team analysis, expert consultation, and peer review of findings.' },
    { num: '6', title: 'Courtroom Presentation', desc: 'Generate reports, visual aids, and presentations for legal proceedings.' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function Home() {
    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroContainer}>
                    <motion.div
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className={styles.heroTitle}>
                            <span className={styles.heroHighlight}>Smart Crime Scene</span><br />
                            Reconstruction System
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Advanced AI-powered forensic analysis, 3D visualization, and collaborative investigation platform for modern law enforcement.
                        </p>
                        <div className={styles.heroButtons}>
                            <Link href="/dashboard" className="btn btn-primary">
                                <FAIcon icon={faPlayCircle} /> Get Started
                            </Link>
                            <Link href="/upload" className="btn btn-outline">
                                <FAIcon icon={faUpload} /> Upload Case
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        className={styles.heroVisual}
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.visualCard}>
                            <div className={styles.visualGraphic}>
                                <motion.div
                                    className={styles.graphicElement}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <FAIcon icon={faRobot} />
                                    <span className={styles.pulse}></span>
                                </motion.div>
                                <motion.div
                                    className={styles.graphicElement}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                >
                                    <FAIcon icon={faCube} />
                                    <span className={`${styles.pulse} ${styles.delay1}`}></span>
                                </motion.div>
                                <motion.div
                                    className={styles.graphicElement}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                >
                                    <FAIcon icon={faSearch} />
                                    <span className={`${styles.pulse} ${styles.delay2}`}></span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className={styles.features}>
                <div className="container">
                    <h2 className="section-title">System Capabilities</h2>
                    <p className="section-subtitle">Comprehensive forensic investigation tools powered by AI and advanced visualization</p>
                    <motion.div
                        className={styles.featuresGrid}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {features.map((f, i) => (
                            <motion.div key={i} className={styles.featureCard} variants={itemVariants}>
                                <div className={styles.featureIcon}>
                                    <FAIcon icon={f.icon} />
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                                <Link href={f.link} className={styles.featureLink}>
                                    {f.linkText} <FAIcon icon={faArrowRight} />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className={styles.workflow}>
                <div className="container">
                    <h2 className="section-title">Forensic Investigation Workflow</h2>
                    <motion.div
                        className={styles.workflowSteps}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {workflowSteps.map((s, i) => (
                            <motion.div key={i} className={styles.step} variants={itemVariants}>
                                <div className={styles.stepNumber}>{s.num}</div>
                                <div className={styles.stepContent}>
                                    <h3>{s.title}</h3>
                                    <p>{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
}
