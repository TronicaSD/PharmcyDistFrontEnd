import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { IInvoice } from '../../interface/IInvoice';

import { NbDialogService, NbToastrService } from '@nebular/theme';
import { PublicService } from 'src/app/core/publicService.Service';
import { LocalDataSource } from 'ng2-smart-table';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  selectedPharmcy:any;
  selectedInvoiceTypeItem = '';
  selectedPharmcyItem = '';
  selectedItem = '';
  Invoices: any;
  invoiceTypeList: any = [
    { Value: 1, Text: "اجل" },
    { Value: 2, Text: "مدفوعه" },

  ];

  closeResult: string;
  AddForm: FormGroup;
  EditForm: FormGroup;

  Drugs: any;
  Pharmcies: any;
  StockDetails: any;
  Total: number;
  SubTotal: number;
  qunantity: any;
  price: any;
  newDate: string;

  public source: LocalDataSource = new LocalDataSource();

  selected: any;
  TotalDiscount: any;
  TotalDiscountEdit: any;
  TotalEdit: any;
  InvoiceNumber: string;
  EditInvoiceNumber: string;
  currentLang: string;
  columnheaders: string[];

  constructor(private _PublicService: PublicService
    , private dialogService: NbDialogService
    , private _formbuilder: FormBuilder
    , private _ToasterService: NbToastrService
    , private translate: TranslateService
    , private _changeDetectorRef: ChangeDetectorRef
  ) {

    this.AddForm = this._formbuilder.group({
      InvoiceDate: [new Date(), Validators.required],
      InvoiceType: [1, Validators.required],
      PharmcyId: ['', Validators.required],
      TotalPrice: [''],
      DisCount: ['15', [Validators.required,
      Validators.min(12), Validators.maxLength(2),
      Validators.max(30)]],

      invoiceDetails: this._formbuilder.array([])

    });

    this.EditForm = this._formbuilder.group({
      Id: [''],
      InvoiceDate: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      PharmcyId: ['', Validators.required],
      TotalPrice: [''],
      DisCount: ['', [Validators.required,
      Validators.min(12),
      Validators.max(30)]
      ],

      invoiceDetails: this._formbuilder.array([])
    });
    this.AddForm.valueChanges.subscribe(x => {
     
      this.calculateDrugPrice();
    })
   
    this.currentLang = translate.currentLang;
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      // TODO This as a workaround.
      this._changeDetectorRef.detectChanges();
    });



  }

  ngOnInit(): void {
    this.getAllInvoice();
    this.getAllStockDetails();
    this.getAllPharmcies();
    this.EditInvloiceDetailsList();
    this.setColumnheaders();
    //LISTEN TO EVENTS
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }
  setColumnheaders(): void {
   
    
    this.columnheaders = ['', '', '']
    //Used TranslateService from @ngx-translate/core
    this.translate.get('InvoiceNumber').subscribe(label => { this.columnheaders[0] = label});
    this.translate.get('PharmcyName').subscribe(label => this.columnheaders[1] = label);
    this.translate.get('InvoiceType').subscribe(label => this.columnheaders[2] = label);
    this.translate.get('InvoiceDate').subscribe(label => this.columnheaders[3] = label);
    this.translate.get('Discount').subscribe(label => this.columnheaders[4] = label);
    this.translate.get('TotalPrice').subscribe(label => this.columnheaders[5] = label);
    this.translate.get('TotalAfterDiscount').subscribe(label => this.columnheaders[6] = label);

    this.loadTableSettings();

  }
  settings: any;
  loadTableSettings() {
    let actionsColumn = "";
    this.translate.get('Action').subscribe(val => { actionsColumn = val; })
    this.settings = {
      // hideSubHeader: true,
      actions: {
        position: "right",
        columnTitle: actionsColumn,
        custom: [

          {
            name: 'viewAction',
            title: '<i class="fa fa-eye text-primary"></i>'
          },
          {
            name: 'editAction',
            title: '<i class="fa fa-edit text-warning"></i>'
          },
          {
            name: 'deleteAction',
            title: '<i class="fa fa-trash text-danger"></i>'
          }
        ],
        add: false,
        edit: false,
        delete: false,
      },

      columns: {

        invoiceNumber: {
          title: this.columnheaders[0],
          type: 'string',
        filter: true,

        },

        pharmcyName: {
          title: this.columnheaders[1],
          type: 'string',
        },
        invoiceTypeText: {
          title: this.columnheaders[2],
          type: 'string',
        filter: false,

        },
        invoiceDate: {
          title: this.columnheaders[3],
          type:"string",
          width: '12%',
        filter: false,
          valuePrepareFunction: (invoiceDate) => {
            if (invoiceDate) {
              let date=new Date(invoiceDate);

              return date.getDate()+'-'+date.getMonth()+1+'-'+date.getFullYear();
            }
            return null;
          }
        },
        disCount: {
          title: this.columnheaders[4],
          type: 'string',
        filter: false,

          valuePrepareFunction: (disCount) => {
            if (disCount) {

              return disCount + '%';
            }
            return null;
          }
        },
        totalPrice: {
          title: this.columnheaders[5],
        filter: false,
          type: 'string',
        },
        totalPriceAfterDis: {
        filter: false,
          title: this.columnheaders[6],
          type: 'string',
        },

      }
    };
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
  unpaidInovices:any=[];
  getUnpadidInvoices(){
    
    this._PublicService.getByID("Invoice/GetByPharmcy",this.selectedPharmcy).subscribe(res => {
      this.unpaidInovices = res;
 
    });

  }

  confirmPay(dialog:TemplateRef<any>,data:IInvoice){
this.dialogService.open(dialog).onClose.subscribe({
next:(res)=>{
  this.payInvoice(data);
},error:()=>{
  this._ToasterService.danger("Failed to request"); 
}

})
  }
  payInvoice(invoice:any){

    this._PublicService.put("Invoice/ChangeStatus",invoice).subscribe(

    {
      next:()=>{
        this._ToasterService.success("Invoice Paied successfully", "Success");
        this. getUnpadidInvoices();
        this. getAllInvoice();
      },
      error:()=>{
        this._ToasterService.danger("Invoice failed to pay", "Failed");
      }
    }
    );

  }
  public hasError = (controlName: string, errorName: string) => {
    return this.AddForm.controls[controlName].hasError(errorName);
  };
  public hasEditError = (controlName: string, errorName: string) => {
    return this.EditForm.controls[controlName].hasError(errorName);
  };


  CalculateTotal() {
    this.Total = this.AddinvoiceDetails.value.reduce((sum, item) => sum += (item.qunantity || 0) * (item.price || 0), 0)
    this.AddForm.controls['TotalPrice'].setValue(this.Total);
    if ((parseInt(this.AddForm.get('DisCount').value)) >= 12 && (parseInt(this.AddForm.get('DisCount').value)) <= 30) {
      this.TotalDiscount = (parseInt(this.AddForm.get('TotalPrice').value) - ((parseInt(this.AddForm.get('TotalPrice').value)) * (parseInt(this.AddForm.get('DisCount').value))) / 100);
    } else {
      this.TotalDiscount = null;
    }


  }
  calculateDrugPrice() {
    this.AddinvoiceDetails.controls.forEach(x => {
      let drugId = parseInt(x.get('drugId').value);
      var drug = this.StockDetails.find(a => a.drugId == drugId);
     
      x.get('price').patchValue(drug.price);
     

      let price = parseInt(x.get('price').value)
      let quantity = parseInt(x.get('qunantity').value);

      if ((price !== NaN) && (quantity !== NaN)) {

        this.price = price * quantity;
        x.get('total').patchValue(this.price)
      }
    });
  }
  newInoiceDetails(): FormGroup {

    var newInoiceDetails = this._formbuilder.group({
      drugId: null,
      drugName: "",
      invoiceId: 0,
      price: null,
      qunantity: null,
      total: null,
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
    this.CalculateTotal();
  }

  Add() {
    let date=new Date(Date.UTC(
      this.AddForm.value.InvoiceDate.getFullYear(),
      this.AddForm.value.InvoiceDate.getMonth(),
      this.AddForm.value.InvoiceDate.getDate()
    ));
    this.AddForm.controls.InvoiceDate.setValue(date);
   
    this._PublicService.post('Invoice/AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllInvoice();
    this.ClearForm();

      this._ToasterService.success("Invoice added successfully", "Success");
    }, (error) => {
      this._ToasterService.danger("The quantity is less than that in stock", "Failed");
    });
  }

  openAddModal(dialog: TemplateRef<any>) {
    this.addInvloiceDetailsList();
    this.dialogService.open(dialog, {
      dialogClass: 'lg-modal'
    });
  }


  CalculateEditTotal() {
    this.TotalEdit = this.EditInvoiceDetails.value.reduce((sum, item) => sum += (item.qunantity || 0) * (item.price || 0), 0)
    this.EditForm.controls['TotalPrice'].setValue(this.TotalEdit);

    if ((parseInt(this.EditForm.get('DisCount').value)) >= 12 && (parseInt(this.EditForm.get('DisCount').value)) <= 30) {
      this.TotalDiscountEdit
        = (parseInt(this.EditForm.get('TotalPrice').value) - ((parseInt(this.EditForm.get('TotalPrice').value)) * (parseInt(this.EditForm.get('DisCount').value))) / 100);
    } else {
      this.TotalDiscountEdit = null;
    }


  }
  calculateEditDrugPrice() {
    this.EditInvoiceDetails.controls.forEach(x => {
      let drugId = parseInt(x.get('drugId').value);
      var drug = this.StockDetails.find(a => a.drugId == drugId);
     
      x.get('price').patchValue(drug.price);
     
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
    this.CalculateEditTotal();

  }
 

  openEditModal(dialog: TemplateRef<any>, row: any) {
    this.EditForm.controls['Id'].setValue(row.id);
    this.EditForm.controls['InvoiceDate'].setValue(row.invoiceDate);
    this.EditForm.controls['InvoiceType'].setValue(row.invoiceType);
    this.EditForm.controls['PharmcyId'].setValue(row.pharmcyId);
    this.EditForm.controls['TotalPrice'].setValue(row.totalPrice);
    this.EditForm.controls['DisCount'].setValue(row.disCount);
    if ((parseInt(this.EditForm.get('DisCount').value))) {
      this.TotalDiscountEdit
        = (parseInt(this.EditForm.get('TotalPrice').value) - ((parseInt(this.EditForm.get('TotalPrice').value)) * (parseInt(this.EditForm.get('DisCount').value))) / 100);

    }
    this.TotalEdit = this.EditForm.get('TotalPrice').value;

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


    }, (error) => {

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

    this.AddForm.controls['InvoiceDate'].setValue(new Date());
    this.AddForm.controls['InvoiceType'].setValue(1);
    this.AddForm.controls['DisCount'].setValue('15');

    this.EditForm.controls['InvoiceDate'].setValue(new Date());
    this.EditForm.controls['InvoiceType'].setValue(1);
    this.EditForm.controls['DisCount'].setValue('15');

  }
  viewModel:any={};

  openViewModal(dialog:any,data:any){

    console.log(data);
    this.dialogService.open(dialog, {
      dialogClass: 'lg-modal'
    });

this.viewModel=data;
  }

  onCustomAction(Deletedialog: TemplateRef<any>, Editdialog: TemplateRef<any>,Viewdialog:TemplateRef<any>, event) {

    switch (event.action) {
      case 'deleteAction':
        this.openDeleteModal(Deletedialog, event.data.id)
        break;
      case 'editAction':
        this.openEditModal(Editdialog, event.data)
        break;
        case 'viewAction':
          this.openViewModal(Viewdialog, event.data)
          break;

    }
  }

}
