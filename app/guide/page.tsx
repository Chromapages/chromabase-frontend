import fs from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, BookOpen, Clock, Users, Shield, Zap } from 'lucide-react';
import { ROUTES } from '@/constants';
import Link from 'next/link';

export default async function GuidePage() {
    const guidePath = path.join(process.cwd(), 'USER_GUIDE.md');
    let content = '';

    try {
        content = await fs.readFile(guidePath, 'utf8');
    } catch (error) {
        console.error('Error reading USER_GUIDE.md:', error);
        content = '# Error\nCould not load the user guide. Please ensure USER_GUIDE.md exists in the project root.';
    }

    // Simple TOC extraction for the sidebar
    const tocItems = content
        .split('\n')
        .filter(line => line.startsWith('## '))
        .map(line => {
            const title = line.replace('## ', '').trim();
            const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return { title, id };
        })
        .slice(0, 15); // Limit for the sidebar

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* ── Page Header ───────────────────────────────────── */}
            <div className="border-b border-border/40 bg-muted/30 backdrop-blur-sm sticky top-0 z-30">
                <div className="container max-w-7xl mx-auto px-4 py-8 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary text-sm font-medium tracking-wide uppercase">
                            <BookOpen className="w-4 h-4" />
                            <span>Knowledge Base</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            User Guide & Documentation
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-2xl">
                            Everything you need to know about mastering ChromaBASE CRM, from lead management to advanced workflows.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
                {/* ── Table of Contents (Sticky Sidebar) ─────────────── */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <div className="sticky top-32 space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 px-2">
                                Jump to Section
                            </h2>
                            <nav className="flex flex-col gap-1">
                                {tocItems.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className="text-[13px] px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150 flex items-center gap-2 group"
                                    >
                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="truncate">{item.title}</span>
                                    </a>
                                ))}
                            </nav>
                        </div>

                        <div className="pt-6 border-t border-border">
                            <div className="bg-primary/5 rounded-2xl p-5 space-y-3 border border-primary/10">
                                <Zap className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-semibold">Need more help?</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed italic">
                                    "The best way to learn is by doing. Try creating a lead or a task to see the magic happen."
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── Main Content Area ─────────────────────────────── */}
                <main className="flex-1 max-w-3xl min-w-0">
                    <div className="prose prose-slate dark:prose-invert max-w-none 
                        prose-headings:scroll-mt-32 prose-headings:font-bold prose-headings:tracking-tight
                        prose-h2:text-2xl prose-h2:border-b prose-h2:border-border prose-h2:pb-3 prose-h2:mt-12
                        prose-h3:text-xl prose-h3:mt-8
                        prose-p:leading-relaxed prose-p:text-muted-foreground/90 
                        prose-li:text-muted-foreground/90
                        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:rounded-xl
                        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:italic
                        prose-table:border prose-table:border-border prose-table:rounded-xl
                        prose-th:bg-muted/50 prose-th:px-4 prose-th:py-3
                        prose-td:px-4 prose-td:py-3
                        "
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h2: ({ node, ...props }) => {
                                    const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                    return <h2 id={id} {...props} />;
                                }
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </main>
            </div>
        </div>
    );
}
