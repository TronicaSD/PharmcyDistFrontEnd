export interface IInvoice {
    id?: number;
    InvoiceNumber: number;
    PharmcyId: number;
    PharmcyName: string;
    InvoiceType: number;
    InvoiceTypeText: string;
    InvoiceDate: Date;
    TotalPrice: number;
    DisCount?: number;


} 