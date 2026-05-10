'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import '@/lib/fontawesome';

interface FAIconProps {
    icon: IconProp;
    className?: string;
    size?: string;
    style?: Record<string, string | number>;
}

export default function FAIcon({ icon, className, size, style }: FAIconProps) {
    return <FontAwesomeIcon icon={icon} className={className} size={size as any} style={style as any} />;
}
