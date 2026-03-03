'use client';

import { use, useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useQuotes } from '@/hooks';
import { Quote, QuoteLineItem, QuoteStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES, QUOTE_STATUS_OPTIONS } from '@/constants';
import { TableSkeleton } from '@/components/shared/loading-skeleton';

export default function QuoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === 'new';

    const { useGet, useUpdate, useCreate } = useQuotes();
    const { data: existingQuote, isLoading } = useGet(isNew ? '' : id, { enabled: !isNew });
    const updateQuote = useUpdate();
    const createQuote = useCreate();

    const [quote, setQuote] = useState<Partial<Quote>>({
        title: '',
        status: 'draft',
        clientId: '',
        lineItems: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        notes: '',
    });

    useEffect(() => {
        if (existingQuote && !isNew) {
            setQuote(existingQuote);
        }
    }, [existingQuote, isNew]);

    const handleLineItemChange = (index: number, field: keyof QuoteLineItem, value: any) => {
        const newItems = [...(quote.lineItems || [])];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].total = (newItems[index].quantity || 0) * (newItems[index].unitPrice || 0);
        }

        updateTotals(newItems);
    };

    const addLineItem = () => {
        const newItem: QuoteLineItem = {
            id: Math.random().toString(36).substring(7),
            description: '',
            quantity: 1,
            unitPrice: 0,
            total: 0
        };
        updateTotals([...(quote.lineItems || []), newItem]);
    };

    const removeLineItem = (index: number) => {
        const newItems = [...(quote.lineItems || [])];
        newItems.splice(index, 1);
        updateTotals(newItems);
    };

    const updateTotals = (items: QuoteLineItem[]) => {
        const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
        const tax = subtotal * 0.1; // Simulated 10% tax
        const total = subtotal + tax;

        setQuote(prev => ({
            ...prev,
            lineItems: items,
            subtotal,
            tax,
            total
        }));
    };

    const handleSave = async () => {
        if (isNew) {
            await createQuote.mutateAsync({
                ...quote,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                id: Math.random().toString(36).substring(7), // Temporary ID generation for demo
            } as Quote);
            router.push(ROUTES.QUOTES);
        } else {
            await updateQuote.mutateAsync({
                id: existingQuote!.id,
                data: { ...quote, updatedAt: Date.now() }
            });
        }
    };

    if (isLoading) return <div className="p-6 max-w-5xl mx-auto"><TableSkeleton rows={10} /></div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" asChild className="rounded-full shadow-sm bg-card border border-border/50">
                    <Link href={ROUTES.QUOTES}><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div className="text-sm text-muted-foreground flex items-center">
                    <Link href={ROUTES.QUOTES} className="hover:text-foreground transition-colors">Quotes</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground font-medium">{isNew ? 'New Quote' : existingQuote?.title}</span>
                </div>
            </div>

            <PageHeader
                title={isNew ? 'Create Quote' : 'Edit Quote'}
                description={isNew ? 'Draft a new proposal for your client.' : 'Update the line items and details of this quote.'}
            >
                <Button onClick={handleSave} disabled={updateQuote.isPending || createQuote.isPending} className="shadow-sm">
                    <Save className="w-4 h-4 mr-2" />
                    {isNew ? 'Create Quote' : 'Save Changes'}
                </Button>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="shadow-sm border-border/50">
                        <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                            <CardTitle>Line Items</CardTitle>
                            <CardDescription>Add the products or services included in this quote.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                                        <TableHead className="w-[40%]">Description</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quote.lineItems?.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No line items yet. Click below to add one.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {quote.lineItems?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                                                    placeholder="Item description"
                                                    className="bg-transparent border-transparent hover:border-border focus:border-ring transition-colors"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                    className="w-20 bg-transparent border-transparent hover:border-border focus:border-ring transition-colors"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <span className="text-muted-foreground mr-1">$</span>
                                                    <Input
                                                        type="number"
                                                        value={item.unitPrice}
                                                        onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                        className="w-24 bg-transparent border-transparent hover:border-border focus:border-ring transition-colors"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ${item.total?.toFixed(2) || '0.00'}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => removeLineItem(index)} className="text-muted-foreground hover:text-destructive">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="p-4 border-t border-border/50 bg-muted/10">
                                <Button variant="outline" size="sm" onClick={addLineItem} className="w-full border-dashed bg-card hover:bg-muted">
                                    <Plus className="w-4 h-4 mr-2" /> Add Line Item
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-sm border-border/50">
                        <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4 text-sm flex flex-col">
                            <div className="space-y-2">
                                <Label htmlFor="title">Quote Title</Label>
                                <Input
                                    id="title"
                                    value={quote.title || ''}
                                    onChange={(e) => setQuote({ ...quote, title: e.target.value })}
                                    placeholder="e.g. Website Redesign Q3"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={quote.status} onValueChange={(val: QuoteStatus) => setQuote({ ...quote, status: val })}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {QUOTE_STATUS_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-border/50">
                        <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4 text-sm">
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Subtotal</span>
                                <span>${(quote.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Tax (10%)</span>
                                <span>${(quote.tax || 0).toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-border/50 w-full my-2"></div>
                            <div className="flex justify-between items-center font-semibold text-lg text-foreground">
                                <span>Total</span>
                                <span>${(quote.total || 0).toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
