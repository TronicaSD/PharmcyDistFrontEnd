import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { IInvoice } from '../../interface/IInvoice';
import * as moment from "moment";
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { PublicService } from 'src/app/core/publicService.Service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  selectedInvoiceTypeItem = '';
  selectedPharmcyItem = '';
  selectedItem = '';
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
  Drugs: any;
  Pharmcies: Object;
  StockDetails: Object;
  Total: number;
  SubTotal: number;
  qunantity: any;
  price: any;
  newDate: string;
  settings = {
    hideSubHeader: true,
    actions: {
      custom: [

        {
          name: 'editAction',
          title: '<i class="fa fa-edit text-warning"></i>'
        },
        {
          name: 'deleteAction',
           title:'<i class="fa fa-trash text-danger"></i>'
        }
      ],
      add: false,
      edit: false,
      delete: false
    },

    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      invoiceNumber: {
        title: 'invoice Number',
        type: 'string',
      },

      pharmcyName: {
        title: 'pharmcy Name',
        type: 'string',
      },
      invoiceTypeText: {
        title: 'invoice Type',
        type: 'string',
      },
      invoiceDate: {
        title: 'invoice Date',
        type: 'string',
      },
      disCount: {
        title: 'disCount',
        type: 'string',
      },
      totalPrice: {
        title: 'total Price',
        type: 'string',
      },

    }
  };
  source: LocalDataSource = new LocalDataSource();
 
  selected: any;

  constructor(private _PublicService: PublicService
    , private dialogService: NbDialogService
    , private _formbuilder: FormBuilder
    , private _ToasterService: NbToastrService

  ) {

    this.AddForm = this._formbuilder.group({
      InvoiceDate: ['', Validators.required],
      InvoiceNumber: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      PharmcyId: ['', Validators.required],
      TotalPrice: [''],
      DisCount: ['', [
        Validators.min(10),
        Validators.max(30)]],
      Country_Id: ['', Validators.required],
      City_Id: ['', Validators.required],
      Governerate_Id: ['', Validators.required],
      invoiceDetails: this._formbuilder.array([])

    });

    this.EditForm = this._formbuilder.group({
      Id: [''],
      InvoiceDate: ['', Validators.required],
      InvoiceNumber: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      PharmcyId: ['', Validators.required],
      TotalPrice: [''],
      DisCount: ['', [
        Validators.min(10),
        Validators.max(30)]
      ],
  
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
    this._PublicService.get("Pharmcy/ViewGetAll").subscribe(res => {
      this.Pharmcies = res;
    });
  }

 

  getAllStockDetails() {

    this._PublicService.get("StockDetails/ViewGetAll").subscribe(res => {
      this.StockDetails = res;


    });
  }
  getAllInvoice() {
    this._PublicService.get("Invoice/ViewGetAll").subscribe(res => {
      this.Invoices = res;
      this.source.load(this.Invoices);

    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.AddForm.controls[controlName].hasError(errorName);
  };
  public hasEditError = (controlName: string, errorName: string) => {
    return this.EditForm.controls[controlName].hasError(errorName);
  };



  /////////////add////////////////////
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
    debugger;
    this._PublicService.post('Invoice/AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllInvoice();
      this._ToasterService.success("Invoice added successfully", "Success");
    }, (error) => {
      this._ToasterService.danger("The quantity is less than that in stock", "Failed");
    });
    this.ClearForm();
  }

  openAddModal(dialog: TemplateRef<any>) {
    this.addInvloiceDetailsList();
    this.dialogService.open(dialog, {
      dialogClass: 'lg-modal'
    });
  }

  ////////////////Edit Modal
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
  openEditModal(dialog: TemplateRef<any>, row: any) {
    this.EditForm.controls['Id'].setValue(row.id);
    this.EditForm.controls['InvoiceDate'].setValue(row.invoiceDate);
    this.EditForm.controls['InvoiceNumber'].setValue(row.invoiceNumber);
    this.EditForm.controls['InvoiceType'].setValue(row.invoiceType);
    this.EditForm.controls['PharmcyId'].setValue(row.pharmcyId);
    this.EditForm.controls['TotalPrice'].setValue(row.totalPrice);
    this.EditForm.controls['DisCount'].setValue(row.disCount);
    this.EditForm.controls['Country_Id'].setValue(row.country_Id);
    this.EditForm.controls['City_Id'].setValue(row.city_Id);
    this.EditForm.controls['Governerate_Id'].setValue(row.governerate_Id);
 
    this.invoiceDetailsEdit.removeAt(0);
    row.invoiceDetails.forEach(x => {
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
      dialogClass: 'lg-modal'
    });
  }
  updateInvoice() {
    this._PublicService.put('Invoice/UpdateData', this.EditForm.value).subscribe((Response) => {
      this._ToasterService.success("Invoice Updated successfully", "Success");
      this.getAllInvoice();
      debugger;

    }, (error) => {
      debugger;
      this._ToasterService.danger("The quantity is less than that in stock", "Failed");
    });
    this.EditForm.reset();

  }


  //Delete Modal
  DeleteInvoice(id: any) {
    this._PublicService.delete("Invoice/DeleteData", id).subscribe((Response) => {
      this.getAllInvoice();
      this._ToasterService.success("Invoice Deleted successfully", "Success");
    }, (error) => {
      this._ToasterService.danger("Failed To Delete ", "Failed");
    });

  }
  openDeleteModal(dialog: TemplateRef<any>, id: any) {
    this.dialogService.open(dialog, {
      dialogClass: 'defaultdialogue'
    }).onClose.subscribe(res => {
      debugger;
      if (res) {

        this.DeleteInvoice(id);
      }


    });
  }

  ClearForm() {

    this.AddForm.reset();
    this.EditForm.reset();
    const Editcontrol = <FormArray>this.EditForm.controls['invoiceDetails'];
    for (let i = Editcontrol.length - 1; i >= 0; i--) {
      Editcontrol.removeAt(i)
    }

    const Addcontrol = <FormArray>this.AddForm.controls['invoiceDetails'];
    for (let i = Addcontrol.length - 1; i >= 0; i--) {
      Addcontrol.removeAt(i)
    }

  }
  onCustomAction(Deletedialog: TemplateRef<any>, Editdialog: TemplateRef<any>, event) {
    debugger;
    switch (event.action) {
      case 'deleteAction':
        this.openDeleteModal(Deletedialog, event.data.id)
        break;
      case 'editAction':
        this.openEditModal(Editdialog, event.data)
        break;

    }
  }

}
