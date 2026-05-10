'use client';

import { useState, useEffect, useRef } from 'react';
import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import toast from 'react-hot-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { supabase } from '@/lib/supabaseClient';
import {
    faUsers, faUser, faShieldAlt, faClock, faFileAlt,
    faComments, faPaperclip, faPaperPlane, faAt, faCircle, faTasks
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

const teamMembers = [
    { name: 'Lead Investigator', role: 'Investigator', status: 'online', statusText: 'Online', primary: true },
    { name: 'Officer John Chen', role: 'Evidence Specialist', status: 'online', statusText: 'Online', primary: false },
    { name: 'Dr. Emily Patel', role: 'Forensic Analyst', status: 'away', statusText: 'Away', primary: false },
    { name: 'Tech. Mike Rodriguez', role: 'Digital Forensics', status: 'offline', statusText: 'Offline', primary: false },
];

const activities = [
    { icon: faFileAlt, title: 'Evidence Added', desc: 'Det. Miller added 3 photos to CS-2024-001', time: '10 min ago', case: 'CS-2024-001' },
    { icon: faComments, title: 'Comment Posted', desc: 'Officer Chen commented on trajectory analysis', time: '25 min ago', case: 'CS-2024-002' },
    { icon: faShieldAlt, title: 'Access Granted', desc: 'Dr. Patel granted access to case files', time: '1 hour ago', case: 'CS-2024-001' },
    { icon: faPaperclip, title: 'Document Shared', desc: 'Forensic report shared with team', time: '2 hours ago', case: 'CS-2024-001' },
];

interface ChatMessage {
    author: string;
    avatar: typeof faUser;
    text: string;
    time: string;
    isOwn?: boolean;
}

const initialMessages: ChatMessage[] = [
    { author: 'Det. Miller', avatar: faUser, text: 'I\'ve uploaded the new crime scene photos. Please review the entry point evidence.', time: '10:30 AM' },
    { author: 'Officer Chen', avatar: faUser, text: 'Thanks! I\'ll check the tool marks and add my analysis.', time: '10:35 AM' },
    { author: 'Dr. Patel', avatar: faUser, text: 'The blood spatter analysis is complete. I\'ve added the report to the evidence section.', time: '10:42 AM' },
    { author: 'You', avatar: faUser, text: 'Great work everyone. I\'ll start the 3D reconstruction based on these findings.', time: '10:45 AM', isOwn: true },
];

export default function CollaborationPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showMentions, setShowMentions] = useState(false);
    const { playMessage, playClick, playSuccess } = useSoundEffects();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [channel, setChannel] = useState<any>(null);

    // Initialize Supabase Realtime & Fetch Initial Messages
    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
            if (data && !error) {
                const formatted = data.map((m: any) => ({
                    author: m.author,
                    avatar: faUser,
                    text: m.text,
                    time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: m.author === 'You'
                }));
                setMessages(formatted);
            }
        };

        fetchMessages();

        const chatChannel = supabase.channel('realtime:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMsg = payload.new as any;
                // Only add if it's not our own message (we add ours optimistically, or we can just rely on this event)
                // Let's just rely on the event for everyone to ensure sync, or add optimistically and deduplicate.
                // For simplicity, if author !== 'You', add it.
                if (newMsg.author !== 'You') {
                    setMessages(prev => [...prev, {
                        author: newMsg.author,
                        avatar: faUser,
                        text: newMsg.text,
                        time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isOwn: false
                    }]);
                    playMessage();
                }
            })
            // Keep typing indicator on broadcast
            .on('broadcast', { event: 'typing' }, () => {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 2000);
            })
            .subscribe();

        setChannel(chatChannel);
        return () => { supabase.removeChannel(chatChannel); };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        
        if (val.endsWith('@')) setShowMentions(true);
        else if (!val.includes('@')) setShowMentions(false);

        if (channel) channel.send({ type: 'broadcast', event: 'typing', payload: {} });
    };

    const insertMention = (name: string) => {
        setInputValue(prev => prev.replace(/@$/, `@${name} `));
        setShowMentions(false);
        playClick();
    };

    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        const msgText = inputValue;
        setInputValue('');
        setShowMentions(false);
        
        // Optimistic UI update
        const newMessage: ChatMessage = {
            author: 'You',
            avatar: faUser,
            text: msgText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true,
        };
        setMessages(prev => [...prev, newMessage]);
        playMessage();
        
        // Insert into Supabase DB
        const { error } = await supabase.from('messages').insert([
            { author: 'You', text: msgText }
        ]);

        if (error) {
            toast.error('Failed to send message');
            console.error(error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <PageLoader type="collaboration">
        <div className={styles.collaboration} role="main" aria-label="Collaboration page">
            <div className="container">
                <h1>Collaboration</h1>
                <p>Team workspace and real-time communication</p>

                <div className="section">
                    <div className="section-header">
                        <h2>Team Members</h2>
                        <button className="btn btn-sm btn-primary" onClick={() => { playSuccess(); toast.success('Invite link copied to clipboard!'); }}>
                            <FAIcon icon={faUsers} /> Invite Member
                        </button>
                    </div>
                    <div className={styles.teamGrid}>
                        {teamMembers.map((m, i) => (
                            <div key={i} className={styles.teamMember}>
                                <div className={`${styles.memberAvatar} ${m.primary ? styles.primary : ''}`}>
                                    <FAIcon icon={faUser} />
                                    <span className={`${styles.statusDot} ${styles[m.status]}`}></span>
                                </div>
                                <div className={styles.memberInfo}>
                                    <h3>{m.name}</h3>
                                    <p className={styles.memberRole}>{m.role}</p>
                                    <span className={`${styles.memberStatus} ${styles[m.status]}`}>
                                        {m.statusText}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <div className="section-header">
                        <h2>Recent Activity</h2>
                    </div>
                    <div className={styles.activityLog}>
                        {activities.map((a, i) => (
                            <div key={i} className={styles.logEntry}>
                                <div className={styles.logIcon}><FAIcon icon={a.icon} /></div>
                                <div style={{ flex: 1 }}>
                                    <div className={styles.logHeader}>
                                        <h4 className={styles.logAction}>{a.title}</h4>
                                        <span className={styles.logTime}><FAIcon icon={faClock} /> {a.time}</span>
                                    </div>
                                    <p className={styles.logDetails}>{a.desc}</p>
                                    <span className={styles.logCase}>{a.case}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <h2>Team Discussions</h2>
                    <div className={styles.discussions}>
                        <div className={styles.discussionCard}>
                            <div className={styles.discussionHeader}>
                                <h3>CS-2024-001 Discussion</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span className={styles.onlineCount}>
                                        <FAIcon icon={faCircle} style={{ color: 'var(--success)', fontSize: '0.5rem' }} /> 3 online
                                    </span>
                                    <span className={styles.discussionCase}>CS-2024-001</span>
                                </div>
                            </div>
                            <div className={styles.discussionMessages}>
                                {messages.map((m, i) => (
                                    <div key={i} className={`${styles.message} ${m.isOwn ? styles.ownMessage : ''}`}>
                                        <div className={styles.messageAvatar}><FAIcon icon={m.avatar} /></div>
                                        <div className={styles.messageContent}>
                                            <div className={styles.messageHeader}>
                                                <span className={styles.messageAuthor}>{m.author}</span>
                                                <span className={styles.messageTime}>{m.time}</span>
                                            </div>
                                            <p dangerouslySetInnerHTML={{ __html: m.text.replace(/@[\w.]+/g, match => `<span style="color:var(--primary-blue);font-weight:bold;">${match}</span>`) }}></p>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className={styles.typingIndicator}>
                                        <FAIcon icon={faCircle} className={styles.typingDot} />
                                        <FAIcon icon={faCircle} className={styles.typingDot} />
                                        <FAIcon icon={faCircle} className={styles.typingDot} />
                                        <span>Someone is typing...</span>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            <div className={styles.discussionInput} style={{ position: 'relative' }}>
                                {showMentions && (
                                    <div style={{ position: 'absolute', bottom: '100%', left: '40px', background: 'var(--card-bg)', border: '1px solid var(--primary-blue)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 10 }}>
                                        {teamMembers.map(m => (
                                            <button key={m.name} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', padding: '5px' }} onClick={() => insertMention(m.name.replace(' ', ''))}>
                                                @{m.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <button className={styles.inputAction} onClick={() => toast('Attach file', { icon: '📎' })}>
                                    <FAIcon icon={faPaperclip} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Type a message (type @ to mention)..."
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                />
                                <button className={styles.inputAction} onClick={() => setShowMentions(!showMentions)}>
                                    <FAIcon icon={faAt} />
                                </button>
                                <button className="btn btn-primary" onClick={sendMessage}>
                                    <FAIcon icon={faPaperPlane} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <h2><FAIcon icon={faTasks} /> Task Assignment</h2>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                        {teamMembers.map((m, i) => (
                            <div key={i} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(0, 168, 255, 0.1)' }}>
                                <h4 style={{ color: 'var(--primary-blue)', marginBottom: '10px' }}>{m.name}</h4>
                                <select style={{ width: '100%', padding: '8px', background: '#121826', color: 'white', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                                    <option>No Task Assigned</option>
                                    <option>Review CS-2024-001 Footage</option>
                                    <option>Process Ballistics Data</option>
                                    <option>Compile Final Report</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <h2>Shared Resources</h2>
                    <div className={styles.resourcesGrid}>
                        <div className={styles.resourceCard}>
                            <div className={styles.resourceIcon}><FAIcon icon={faFileAlt} /></div>
                            <div className={styles.resourceContent}>
                                <h3>Case Protocols</h3>
                                <p>Standard operating procedures</p>
                            </div>
                        </div>
                        <div className={styles.resourceCard}>
                            <div className={styles.resourceIcon}><FAIcon icon={faShieldAlt} /></div>
                            <div className={styles.resourceContent}>
                                <h3>Security Guidelines</h3>
                                <p>Data handling protocols</p>
                            </div>
                        </div>
                        <div className={styles.resourceCard}>
                            <div className={styles.resourceIcon}><FAIcon icon={faComments} /></div>
                            <div className={styles.resourceContent}>
                                <h3>Training Materials</h3>
                                <p>Team training resources</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </PageLoader>
    );
}
