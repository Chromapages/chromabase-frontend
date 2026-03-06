'use client';

import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface MobileFABProps {
    onClick: () => void;
}

export function MobileFAB({ onClick }: MobileFABProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <motion.button
            whileTap={{ scale: 0.9, rotate: 90 }}
            whileHover={{ scale: 1.05 }}
            onClick={onClick}
            className="fixed bottom-[calc(84px+env(safe-area-inset-bottom))] right-4 w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-[0_8px_24px_rgba(var(--primary-rgb),0.35)] flex items-center justify-center z-[60] hover:shadow-[0_12px_32px_rgba(var(--primary-rgb),0.45)] transition-shadow duration-300"
            aria-label="Add new"
        >
            <Plus className="w-7 h-7 stroke-[2.5]" />
        </motion.button>,
        document.body
    );
}
