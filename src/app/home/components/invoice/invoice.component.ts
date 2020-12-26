import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from 'src/app/Service/Public.Service/public-service.service';
import { IInvoice } from '../../interface/IInvoice';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  selectedInvoiceTypeItem = '0';
  selectedPharmcyItem = '0';
  Invoices: any;
  InvoiceType: any = [
    { Value: 1, Text: "Postponed" },
    { Value: 2, Text: "forefront" },

  ];

  closeResult: string;
  AddForm: FormGroup;
  EditForm: FormGroup;
  InvoiceObject: IInvoice = {
    id: 0,
    InvoiceNumber: 0,
    PharmcyId: 0,
    PharmcyName: '',
    InvoiceType: 0,
    InvoiceTypeText: '',
    InvoiceDate: new Date(),
    TotalPrice: 0,
    DisCount: 0,

  };
  UpdateInvoiceObject: IInvoice =
    {
      id: 0,
      InvoiceNumber: 0,
      PharmcyId: 0,
      PharmcyName: '',
      InvoiceType: 0,
      InvoiceTypeText: '',
      InvoiceDate: new Date(),
      TotalPrice: 0,
      DisCount: 0,
    };
  Drugs: any;
  Pharmcies: Object;
  constructor(private _PublicService: PublicService
    , private modalService: NgbModal
    , private _formbuilder: FormBuilder
  ) {

    this.AddForm = this._formbuilder.group({
      InvoiceDate: ['', Validators.required],
      InvoiceNumber: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      PharmcyId: ['', Validators.required],
      PharmcyName: ['', Validators.required],
      TotalPrice: ['', Validators.required],
      DisCount: ['', Validators.required],


    });

    this.EditForm = this._formbuilder.group({
      DrugId: ['', Validators.required],
      Quantity: ['', Validators.required],

    });
  }

  ngOnInit(): void {
    this.getAllInvoice();
    this.getAllDrugs();
    this.getAllPharmcies();
  }
  ClearData() {
    this.InvoiceObject = {
      id: 0,
      InvoiceNumber: 0,
      PharmcyId: 0,
      PharmcyName: '',
      InvoiceType: 0,
      InvoiceTypeText: '',
      InvoiceDate: new Date(),
      TotalPrice: 0,
      DisCount: 0,

    }
  }
  getAllPharmcies() {
    debugger;
    this._PublicService.getAll("Pharmcy", 'ViewGetAll').subscribe(res => {
      this.Pharmcies = res;
      debugger;

    });
  }
  getAllDrugs() {
    debugger;
    this._PublicService.getAll("Drug", 'ViewGetAll').subscribe(res => {
      this.Drugs = res;
      debugger;

    });
  }
  getAllInvoice() {
    debugger;
    this._PublicService.getAll("Invoice", 'ViewGetAll').subscribe(res => {
      this.Invoices = res;
      debugger;

    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.AddForm.controls[controlName].hasError(errorName);
  };
  //add
  Add() {
    debugger;
    this._PublicService.Add('Invoice', 'AddData', this.AddForm.value).subscribe((Response) => {
      this.modalService.dismissAll();
      this.getAllInvoice();
      // this._ToasterService.FireMessagePopUp(1);
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.ClearData();
  }

  openAddModal(content: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }
  //
  openEditModal(content: any, Id: any) {
    debugger;
    const result: IInvoice = this.Invoices.find(obj => obj.id === Id);
    this.InvoiceObject = result;
    debugger;
    // this.EditForm.controls['DrugId'].setValue(this.InvoiceObject.drugId);
    // this.EditForm.controls['Quantity'].setValue(this.InvoiceObject.quantity);

    debugger;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }
  //Edit Modal
  updateInvoice() {
    // this.UpdateInvoiceObject = {
    // drugId: this.EditForm.value.DrugId,
    // id: this.InvoiceObject.id,
    // quantity: this.EditForm.value.Quantity,
    // drugName: ""

    //    }
    debugger;
    this._PublicService.Update('Invoice', 'UpdateData', this.UpdateInvoiceObject).subscribe((Response) => {
      this.Invoices = Response;
      this.modalService.dismissAll();
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllInvoice();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.ClearData();

  }


  //Delete Modal
  DeleteInvoice(Object: any) {
    debugger;
    this._PublicService.Delete("Invoice", 'DeleteData', Object.id).subscribe((Response) => {
      this.modalService.dismissAll();
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllInvoice();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });

  }
  openDeleteModal(content: any, Object: any) {

    debugger;
    const result: IInvoice = this.Invoices.find((obj: any) => obj.id === Object.id);
    this.InvoiceObject = result;
    debugger;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }



}
