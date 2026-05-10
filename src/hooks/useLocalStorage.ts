'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch {
            // LocalStorage not available
        }
    }, [key, storedValue]);

    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch {
            // LocalStorage not available
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue] as const;
}

export function useFormData(formKey: string, initialFields: Record<string, string>) {
    const [formData, setFormData, clearFormData] = useLocalStorage<Record<string, string>>(
        `forensic_form_${formKey}`,
        initialFields
    );

    const updateField = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, [setFormData]);

    const resetForm = useCallback(() => {
        clearFormData();
    }, [clearFormData]);

    return { formData, updateField, resetForm };
}
