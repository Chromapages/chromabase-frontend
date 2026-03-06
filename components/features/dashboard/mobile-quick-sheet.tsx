'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, CheckSquare, FileText } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface MobileQuickSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileQuickSheet({ isOpen, onClose }: MobileQuickSheetProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const actions = [
        { id: 'lead', label: 'New Lead', icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'task', label: 'New Task', icon: CheckSquare, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { id: 'note', label: 'Add Note', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ] as const;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/40 rounded-t-[32px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-[110] shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
                    >
                        {/* Handle */}
                        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold tracking-tight text-foreground">Quick Action</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {actions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <button
                                        key={action.id}
                                        onClick={() => {
                                            console.log(`Action: ${action.id}`);
                                            onClose();
                                        }}
                                        className="w-full p-4 rounded-2xl bg-muted/30 border border-border/20 flex items-center gap-4 active:scale-[0.98] transition-all"
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center`}>
                                            <Icon className={`w-6 h-6 ${action.color}`} />
                                        </div>
                                        <span className="text-base font-bold text-foreground">{action.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
