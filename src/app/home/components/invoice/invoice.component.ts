import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from 'src/app/Service/Public.Service/public-service.service';

import { IInvoice } from '../../interface/IInvoice';
import * as moment from "moment";
import { NbDialogService } from '@nebular/theme';

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
    invoiceNumber: 0,
    pharmcyId: 0,
    pharmcyName: '',
    invoiceType: 0,
    invoiceTypeText: '',
    invoiceDate: new Date(),
    totalPrice: 0,
    disCount: 0,

    invoiceDetails: [{
      drugId: 0,
      drugName: "",
      invoiceId: 0,
      price: 0,
      qunantity: 0,
      total: 0,
      id: 0
    }]

  };
  UpdateInvoiceObject: IInvoice =
    {
      id: 0,
      invoiceNumber: 0,
      pharmcyId: 0,
      pharmcyName: '',
      invoiceType: 0,
      invoiceTypeText: '',
      invoiceDate: new Date(),
      totalPrice: 0,
      disCount: 0,
      invoiceDetails: [{
        drugId: 0,
        drugName: "",
        invoiceId: 0,
        price: 0,
        qunantity: 0,
        total: 0,
        id: 0
      }]
    };
  Drugs: any;
  Pharmcies: Object;
  StockDetails: Object;
  Total: number;
  SubTotal: number;
  qunantity: any;
  price: any;
  constructor(private _PublicService: PublicService
    , private dialogService: NbDialogService
    , private _formbuilder: FormBuilder
  ) {

    this.AddForm = this._formbuilder.group({
      InvoiceDate: ['', Validators.required],
      InvoiceNumber: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      PharmcyId: ['', Validators.required],
      TotalPrice: [''],
      DisCount: [''],
      invoiceDetails: this._formbuilder.array([])

    });

    this.EditForm = this._formbuilder.group({
      Id: [''],
      InvoiceDate: ['', Validators.required],
      InvoiceNumber: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      PharmcyId: ['', Validators.required],
      TotalPrice: [''],
      DisCount: [''],
      invoiceDetails: this._formbuilder.array([])
    });
  }

  ngOnInit(): void {
    this.getAllInvoice();
    this.getAllStockDetails();
    this.getAllPharmcies();
    this.EditInvloiceDetailsList();

  }

  getAllPharmcies() {

    this._PublicService.getAll("Pharmcy", 'ViewGetAll').subscribe(res => {
      this.Pharmcies = res;


    });
  }
  getAllStockDetails() {

    this._PublicService.getAll("StockDetails", 'ViewGetAll').subscribe(res => {
      this.StockDetails = res;


    });
  }
  getAllInvoice() {

    this._PublicService.getAll("Invoice", 'ViewGetAll').subscribe(res => {
      this.Invoices = res;


    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.AddForm.controls[controlName].hasError(errorName);
  };
  public hasEditError = (controlName: string, errorName: string) => {
    return this.EditForm.controls[controlName].hasError(errorName);
  };



  //add
  CalculateTotal() {
    this.Total = this.AddinvoiceDetails.value.reduce((sum, item) => sum += (item.qunantity || 0) * (item.price || 0), 0)
    this.AddForm.controls['TotalPrice'].setValue(this.Total);
  }
  calculateDrugPrice() {
    this.AddinvoiceDetails.controls.forEach(x => {
      let price = parseInt(x.get('price').value)
      let quantity = parseInt(x.get('qunantity').value)
      this.price = price * quantity;
      x.get('total').patchValue(this.price)
    });
  }
  newInoiceDetails(): FormGroup {
    var newInoiceDetails = this._formbuilder.group({
      drugId: 0,
      drugName: "",
      invoiceId: 0,
      price: 0,
      qunantity: 0,
      total: 0,
      id: 0
    });
    return newInoiceDetails;

  }

  AddinvoiceDetails: FormArray;
  get invoiceDetails(): FormArray {
    this.AddinvoiceDetails = this.AddForm.get("invoiceDetails") as FormArray;
    return this.AddinvoiceDetails;
  }
  addInvloiceDetailsList() {
    this.invoiceDetails.push(this.newInoiceDetails());
  }
  removeInvoiceDetails(i: number) {
    this.invoiceDetails.removeAt(i);
  }

  Add() {
    var date = moment(date);
    //this.AddForm.controls['InvoiceDate'].setValue(date);

    debugger;
    this._PublicService.Add('Invoice', 'AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllInvoice();
      // this._ToasterService.FireMessagePopUp(1);
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.AddForm.reset();

  }

  openAddModal(dialog: TemplateRef<any>) {
    this.addInvloiceDetailsList();
    this.dialogService.open(dialog, {
      context: {
        title: "dd",
      }, dialogClass: 'model-full'
    });
  }
  //

  //Edit Modal
  CalculateEditTotal() {
    this.Total = this.EditInvoiceDetails.value.reduce((sum, item) => sum += (item.qunantity || 0) * (item.price || 0), 0)
    this.EditForm.controls['TotalPrice'].setValue(this.Total);
  }
  calculateEditDrugPrice() {
    this.EditInvoiceDetails.controls.forEach(x => {
      let price = parseInt(x.get('price').value)
      let quantity = parseInt(x.get('qunantity').value)
      this.price = price * quantity;
      x.get('total').patchValue(this.price)
    });
  }
  EditInvoiceDetails: FormArray;
  get invoiceDetailsEdit(): FormArray {
    this.EditInvoiceDetails = this.EditForm.get("invoiceDetails") as FormArray;
    return this.EditInvoiceDetails;
  }
  EditInvloiceDetailsList() {
    this.invoiceDetailsEdit.push(this.newInoiceDetails());
  }
  removeInvoiceDetailsEdit(i: number) {
    this.invoiceDetailsEdit.removeAt(i);
  }
  openEditModal(dialog: TemplateRef<any>, Id: any) {

    const result: IInvoice = this.Invoices.find(obj => obj.id === Id);
    this.InvoiceObject = result;
    debugger;
    this.EditForm.controls['Id'].setValue(this.InvoiceObject.id);
    this.EditForm.controls['InvoiceDate'].setValue(this.InvoiceObject.invoiceDate);
    this.EditForm.controls['InvoiceNumber'].setValue(this.InvoiceObject.invoiceNumber);
    this.EditForm.controls['InvoiceType'].setValue(this.InvoiceObject.invoiceType);
    this.EditForm.controls['PharmcyId'].setValue(this.InvoiceObject.pharmcyId);
    this.EditForm.controls['TotalPrice'].setValue(this.InvoiceObject.totalPrice);
    this.EditForm.controls['DisCount'].setValue(this.InvoiceObject.disCount);
    debugger;
    this.invoiceDetailsEdit.removeAt(0);
    this.InvoiceObject.invoiceDetails.forEach(x => {
      debugger;
      var newEdirInoiceDetails = this._formbuilder.group({
        drugId: x.drugId,
        drugName: "",
        invoiceId: x.invoiceId,
        price: x.price,
        qunantity: x.qunantity,
        total: x.total,
        id: x.id,
      });
      this.invoiceDetailsEdit.push(newEdirInoiceDetails)
    });
    this.dialogService.open(dialog, {
      context: {
        title: "dd",
      }, dialogClass: 'model-full'
    });
  }
  updateInvoice() {
    debugger;
    this._PublicService.Update('Invoice', 'UpdateData', this.EditForm.value).subscribe((Response) => {
      this.Invoices = Response;
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllInvoice();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.EditForm.reset();

  }


  //Delete Modal
  DeleteInvoice(Object: any) {

    this._PublicService.Delete("Invoice", 'DeleteData', Object.id).subscribe((Response) => {
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllInvoice();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });

  }
  openDeleteModal(dialog: TemplateRef<any>, Object: any) {


    const result: IInvoice = this.Invoices.find((obj: any) => obj.id === Object.id);
    this.InvoiceObject = result;

    this.dialogService.open(dialog, {
      context: {
        title: "dd",
      }, dialogClass: 'model-full'
    });
  }

  ClearForm() {
    debugger;

    this.AddForm.reset();
    this.EditForm.reset();
    const Editcontrol = <FormArray>this.EditForm.controls['invoiceDetails'];
    debugger;

    for (let i = Editcontrol.length - 1; i >= 0; i--) {
      debugger;

      Editcontrol.removeAt(i)
    }

    const Addcontrol = <FormArray>this.AddForm.controls['invoiceDetails'];
    for (let i = Addcontrol.length - 1; i >= 0; i--) {
      Addcontrol.removeAt(i)
    }
    debugger;
    this.InvoiceObject = {
      id: 0,
      invoiceNumber: 0,
      pharmcyId: 0,
      pharmcyName: '',
      invoiceType: 0,
      invoiceTypeText: '',
      invoiceDate: new Date(),
      totalPrice: 0,
      disCount: 0,

      invoiceDetails: [{
        drugId: 0,
        drugName: "",
        invoiceId: 0,
        price: 0,
        qunantity: 0,
        total: 0,
        id: 0
      }]

    };

  }

}
