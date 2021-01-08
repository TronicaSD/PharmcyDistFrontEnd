import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from "moment";
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { PublicService } from 'src/app/core/publicService.Service';
import { LocalDataSource } from 'ng2-smart-table';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt-details.component.html',
  styleUrls: ['./receipt-details.component.css']
})
export class receiptDetailsComponent implements OnInit {
  selectedreceiptTypeItem = '';
  selectedPharmcyItem = '';
  selectedItem = '';
  receipts: any;
  receiptTypeList: any = [
    { Value: 1, Text: "اجل" },
    { Value: 2, Text: "مدفوعه" },

  ];

  closeResult: string;
  AddForm: FormGroup;
  EditForm: FormGroup;

  Drugs: any;
  Pharmcies: Object;
  receipt: any;
  Total: number;
  SubTotal: number;
  quantity: any;
  price: any;
  newDate: string;

  public source: LocalDataSource = new LocalDataSource();

  selected: any;
  TotalDiscount: any;
  TotalDiscountEdit: any;
  TotalEdit: any;
  receiptNumber: string;
  EditreceiptNumber: string;
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
      Date: [new Date(), Validators.required],
      TotalPrice: [null],
      receiptDetails: this._formbuilder.array([])

    });

    this.EditForm = this._formbuilder.group({
      Id: [''],
      Date: ['', Validators.required],
      TotalPrice: [null],
      receiptDetails: this._formbuilder.array([])
    });

    this.currentLang = translate.currentLang;
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      this._changeDetectorRef.detectChanges();
    });
    this.setColumnheaders();
  }

  ngOnInit(): void {
    this.getAllreceipt();
    this.getAllDrugs();
    this.EditreceiptDetailsList();
    //LISTEN TO EVENTS
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }
  setColumnheaders(): void {
    let Action = 'Action';
    let Date = 'Date';
    let Type = 'Type';
    let TotalPrice = 'TotalPrice';
    this.columnheaders = ['', '', '']
    //Used TranslateService from @ngx-translate/core
    this.translate.get(Action).subscribe(label => this.columnheaders[0] = label);
    this.translate.get(Type).subscribe(label => this.columnheaders[1] = label);
    this.translate.get(Date).subscribe(label => this.columnheaders[2] = label);
    this.translate.get(TotalPrice).subscribe(label => {
      this.columnheaders[3] = label;
      this.loadTableSettings();
    });

  }
  settings: any;
  loadTableSettings() {
    let actionsColumn = "";
    this.translate.get('Action').subscribe(val => { actionsColumn = val; })
    debugger;
    this.settings = {
      // hideSubHeader: true,
      actions: {
        position: "right",
        columnTitle: actionsColumn,
        custom: [

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
        filter: true
      },

      columns: {
        transactionTypeText: {
          title: this.columnheaders[1],
          type: 'string',
        },
        date: {
          title: this.columnheaders[2],
          type: 'string',
          valuePrepareFunction: (type) => {
            if (type) {
              return moment(type).format('M/d/yyyy');
            }
            return null;
          }
        },
        totalPrice: {
          title: this.columnheaders[3],
          type: 'string',

        }

      }
    };
  }

  getAllreceipt() {
    this._PublicService.get("receipt/ViewGetAll").subscribe(res => {
      this.receipt = res;
      this.source.load(this.receipt);
    });
  }
  getAllDrugs() {

    this._PublicService.get("Drugs/ViewGetAll").subscribe(res => {
      this.Drugs = res;

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
    this.Total = this.AddreceiptDetails.value.reduce((accumulator, current) => parseInt(accumulator) + parseInt(current.quantity), 0);
    this.AddForm.controls['TotalPrice'].setValue(this.Total);
  }

  newreceiptDetails(): FormGroup {
    var newreceiptDetails = this._formbuilder.group({
      drugId: null,
      drugName: "",
      receiptId: 0,
      quantity: null,
      id: 0
    });
    return newreceiptDetails;
  }

  AddreceiptDetails: FormArray;
  get receiptDetails(): FormArray {
    this.AddreceiptDetails = this.AddForm.get("receiptDetails") as FormArray;
    return this.AddreceiptDetails;
  }
  addreceiptDetailsList() {

    this.receiptDetails.push(this.newreceiptDetails());
  }
  removereceiptDetails(i: number) {
    this.receiptDetails.removeAt(i);
    this.CalculateTotal();
  }

  Add() {
    this._PublicService.post('receipt/AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllreceipt();
      this._ToasterService.success("Drugs added To receipts successfully", "Success");
    }, (error) => {
      this._ToasterService.danger("Failed To Update", "Failed");
    });
    this.ClearForm();
  }

  openAddModal(dialog: TemplateRef<any>) {
    this.addreceiptDetailsList();
    this.dialogService.open(dialog, {
      dialogClass: 'lg-modal'
    });
  }

  ////////////////Edit Modal
  CalculateEditTotal() {
    this.TotalEdit = this.EditreceiptDetails.value.reduce((accumulator, current) => parseInt(accumulator) + parseInt(current.quantity), 0);
    this.EditForm.controls['TotalPrice'].setValue(this.TotalEdit);
  }

  EditreceiptDetails: FormArray;
  get receiptDetailsEdit(): FormArray {
    this.EditreceiptDetails = this.EditForm.get("receiptDetails") as FormArray;
    debugger;
    return this.EditreceiptDetails;
  }
  EditreceiptDetailsList() {
    this.receiptDetailsEdit.push(this.newreceiptDetails());
  }
  removereceiptDetailsEdit(i: number) {
    this.receiptDetailsEdit.removeAt(i);
    this.CalculateEditTotal();

  }
  openEditModal(dialog: TemplateRef<any>, row: any) {
    this.EditForm.controls['Id'].setValue(row.id);
    this.EditForm.controls['Date'].setValue(row.date);
    this.EditForm.controls['TotalPrice'].setValue(row.totalPrice);
    this.TotalEdit = this.EditForm.get('TotalPrice').value;

    this.receiptDetailsEdit.removeAt(0);
    row.receiptDetails.forEach(x => {
      debugger;
      var newEdirreceiptDetails = this._formbuilder.group({
        drugId: x.drugId,
        drugName: "",
        receiptId: x.receiptId,
        quantity: x.quantity,
        id: x.id,
      });
      debugger;
      this.receiptDetailsEdit.push(newEdirreceiptDetails)
      debugger;
    });
    this.dialogService.open(dialog, {
      dialogClass: 'lg-modal'
    });
  }
  updatereceipt() {
    debugger;
    this._PublicService.put('receipt/UpdateData', this.EditForm.value).subscribe((Response) => {
      this._ToasterService.success("receipt Updated successfully", "Success");
      this.getAllreceipt();


    }, (error) => {

      this._ToasterService.danger("The quantity is less than that in receipt", "Failed");
    });
    this.EditForm.reset();

  }


  //Delete Modal
  Deletereceipt(id: any) {
    this._PublicService.delete("receipt/DeleteData", id).subscribe((Response) => {
      this.getAllreceipt();
      this._ToasterService.success("receipt Deleted successfully", "Success");
    }, (error) => {
      this._ToasterService.danger("Failed To Delete ", "Failed");
    });

  }
  openDeleteModal(dialog: TemplateRef<any>, id: any) {
    this.dialogService.open(dialog, {
      dialogClass: 'defaultdialogue'
    }).onClose.subscribe(res => {

      if (res) {

        this.Deletereceipt(id);
      }


    });
  }

  ClearForm() {

    this.AddForm.reset();
    this.EditForm.reset();
    const Editcontrol = <FormArray>this.EditForm.controls['receiptDetails'];
    for (let i = Editcontrol.length - 1; i >= 0; i--) {
      Editcontrol.removeAt(i)
    }

    const Addcontrol = <FormArray>this.AddForm.controls['receiptDetails'];
    for (let i = Addcontrol.length - 1; i >= 0; i--) {
      Addcontrol.removeAt(i)
    }

  }
  onCustomAction(Deletedialog: TemplateRef<any>, Editdialog: TemplateRef<any>, event) {

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
