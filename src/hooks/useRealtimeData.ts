'use client';

import { useState, useEffect, useCallback } from 'react';

export function useRealtimeData<T>(initialData: T, interval = 5000) {
    const [data, setData] = useState<T>(initialData);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const updateData = useCallback((updater: (prev: T) => T) => {
        setData(prev => {
            const next = updater(prev);
            setLastUpdate(new Date());
            return next;
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setLastUpdate(new Date());
        }, interval);
        return () => clearInterval(timer);
    }, [interval]);

    return { data, setData, updateData, lastUpdate };
}

export function useLiveStats() {
    const [stats, setStats] = useState({
        activeCases: 12,
        evidenceItems: 147,
        teamMembers: 8,
        aiAnalyses: 89,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setStats(prev => ({
                activeCases: prev.activeCases + (Math.random() > 0.7 ? 1 : 0),
                evidenceItems: prev.evidenceItems + Math.floor(Math.random() * 3),
                teamMembers: prev.teamMembers,
                aiAnalyses: prev.aiAnalyses + (Math.random() > 0.8 ? 1 : 0),
            }));
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return stats;
}
