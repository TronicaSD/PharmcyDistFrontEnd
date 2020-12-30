import { IInvoiceDetails } from "./IInvoiceDetails";

export interface IInvoice {
    id?: number;
    invoiceNumber: number;
    pharmcyId: number;
    pharmcyName: string;
    invoiceType: number;
    invoiceTypeText: string;
    invoiceDate: Date;
    totalPrice: number;
    disCount?: number;
    invoiceDetails: IInvoiceDetails[]

} 