import { ChangeDetectorRef, Component, OnInit, SkipSelf, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  Expenses: any;
  closeResult: string;
  AddForm: FormGroup;
  EditForm: FormGroup;
  TName: string = "";
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  Action: string;
  currentLang: string;
  columnheaders: string[];
  ExpenseTypes: any[];
  Users: any[];
  Method: { id: number; text: any; }[];
  cashPayment: any;
  BankTransfer: any;
  onlinePayment: any;
  constructor(private _PublicService: PublicService
    , private modalService: NgbModal
    , private _formbuilder: FormBuilder
    , private dialogService: NbDialogService
    , private _ToasterService: NbToastrService
    , private translate: TranslateService
    , private _changeDetectorRef: ChangeDetectorRef) {
    this.AddForm = this._formbuilder.group({
      Description: [null, Validators.required],
      UserId: [null, Validators.required],
      ExpenseTypesId: [null, Validators.required],
      Method: [null, Validators.required],
      Amount: [null, Validators.required],
      Date: [null, Validators.required],
    });

    this.EditForm = this._formbuilder.group({
      Description: [null, Validators.required],
      UserId: [null, Validators.required],
      ExpenseTypesId: [null, Validators.required],
      Method: [null, Validators.required],
      Amount: [null, Validators.required],
      Date: [null, Validators.required],
      id: [null],
    });
    this.currentLang = translate.currentLang;
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      // TODO This as a workaround.
      this._changeDetectorRef.detectChanges();
    });

  }

  ngOnInit(): void {
    this.translate.get("cashPayment").subscribe(label => this.cashPayment = label);
    this.translate.get("BankTransfer").subscribe(label => this.BankTransfer = label);
    this.translate.get("onlinePayment").subscribe(label => this.onlinePayment = label);
    this.Method = [
      { id: 1, text: this.cashPayment },
      { id: 2, text: this.BankTransfer },
      { id: 3, text: this.onlinePayment }
    ]
    this.getAllExpenses();
    this.setColumnheaders();
    this.getAllExpenseTypes();
    this.getAllUser();
    //LISTEN TO EVENTS
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }
  setColumnheaders(): void {
    this.columnheaders = ['', '', '']
    //Used TranslateService from @ngx-translate/core
    this.translate.get("Action").subscribe(label => this.columnheaders[0] = label);
    this.translate.get("UserName").subscribe(label => this.columnheaders[1] = label);
    this.translate.get("ExpenseType").subscribe(label => this.columnheaders[2] = label);
    this.translate.get("Amount").subscribe(label => this.columnheaders[3] = label);
    this.translate.get("Descripton").subscribe(label => this.columnheaders[4] = label);
    this.translate.get("Date").subscribe(label => this.columnheaders[5] = label);
    this.translate.get("Method").subscribe(label => {
      this.columnheaders[6] = label;
      this.loadTableSettings();
    });

  }
  loadTableSettings() {
    this.settings = {
      pager: {
        display: true,
        perPage: 10,
        pagging: true,

      },

      // hideSubHeader: true,
      actions: {


        position: "right",
        columnTitle: this.columnheaders[0],
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
        filter: false

      },

      columns: {

        userName: {
          title: this.columnheaders[1],
          type: 'string',
          filter: true
        },
        expenseTypesNameAr: {
          title: this.columnheaders[2],
          type: 'string',
          filter: true
        },
        amount: {
          title: this.columnheaders[3],
          type: 'string',
          filter: true
        },
        description: {
          title: this.columnheaders[4],
          type: 'string',
          filter: true
        },
        date: {
          title: this.columnheaders[5],
          type: "string",
          width: '12%',
          filter: true,
          valuePrepareFunction: (dates) => {
            if (dates) {
              let date = new Date(dates);

              return date.getDate() + '-' + date.getMonth() + 1 + '-' + date.getFullYear();
            }
            return null;
          }
        },
        method: {
          title: this.columnheaders[6],
          type: 'string',
          filter: true,

          valuePrepareFunction: (meth) => {
            if (meth == 1) {

              return this.cashPayment;
            } else if (meth == 2) {
              return this.BankTransfer;

            } else if (meth == 3) {
              return this.onlinePayment;

            }
            return null;
          }
        }
      }
    };
  }
  getAllExpenses() {

    this._PublicService.get("Expense/ViewGetAll").subscribe(res => {
      this.Expenses = res;
      this.source.load(this.Expenses);


    });
  }
  public hasError = (controlName: string, errorName: string) => {

    return this.AddForm.controls[controlName].hasError(errorName);
  };

  public hasEditError = (controlName: string, errorName: string) => {

    return this.EditForm.controls[controlName].hasError(errorName);
  };
  ///////////////////////////////////////
  getAllExpenseTypes() {

    this._PublicService.get("ExpenseTypes/ViewGetAll").subscribe(res => {
      this.ExpenseTypes = res;
      debugger;

    });
  }

  getAllUser() {

    this._PublicService.get("User/GetAllAgents").subscribe(res => {
      this.Users = res;
      debugger;
    });
  }

  ////////////////add/////////////
  openAddDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"
    });
  }
  Add() {
    let date = new Date(Date.UTC(
      this.AddForm.value.Date.getFullYear(),
      this.AddForm.value.Date.getMonth(),
      this.AddForm.value.Date.getDate()
    ));
    this.AddForm.controls.Date.setValue(date);

    debugger;
    this._PublicService.post('Expense/AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllExpenses();

      this._ToasterService.success("Expense Added successfully", "Success");

    }, (error) => {
      this._ToasterService.danger("Failed To add ", "Failed");

    });
    this.AddForm.reset();
  }



  /////////////Edit///////////

  //Edit Modal
  openEditDialog(dialog: TemplateRef<any>, row: any) {
    this.EditForm.controls['UserId'].setValue(row.userId);
    this.EditForm.controls['Description'].setValue(row.description);
    this.EditForm.controls['ExpenseTypesId'].setValue(row.expenseTypesId);
    this.EditForm.controls['Method'].setValue(row.method);
    this.EditForm.controls['Amount'].setValue(row.amount);
    this.EditForm.controls['Date'].setValue(row.date);

    this.EditForm.controls['id'].setValue(row.id);

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    });
  }
  updateExpense() {
    let date = new Date(Date.UTC(
      this.EditForm.value.Date.getFullYear(),
      this.EditForm.value.Date.getMonth(),
      this.EditForm.value.Date.getDate()
    ));
    this.EditForm.controls.Date.setValue(date);

    this._PublicService.put('Expense/UpdateData', this.EditForm.value).subscribe((Response) => {
      this.Expenses = Response;
      this.modalService.dismissAll();
      this._ToasterService.success("Expense Updated successfully", "Success");
      this.getAllExpenses();
    }, (error) => {
      this._ToasterService.danger(" Failed To  Update ", "failed");

    });
    this.EditForm.reset();

  }



  //Delete Modal
  DeleteExpense(id: any) {

    this._PublicService.delete("Expense/DeleteData", id).subscribe((Response) => {
      this.modalService.dismissAll();
      this._ToasterService.success("Expense Deleted successfully", "Success");

      this.getAllExpenses();
    }, (error) => {
      this._ToasterService.danger("Sorry but this item related To another table ", "Failed");

    });

  }



  openDeletedialog(dialog: TemplateRef<any>, id: any) {

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"
    }).onClose.subscribe(res => {

      if (res) {

        this.DeleteExpense(id);
      }


    });
  }

  onCustomAction(Deletedialog: TemplateRef<any>, Editdialog: TemplateRef<any>, event) {

    switch (event.action) {
      case 'deleteAction':
        this.openDeletedialog(Deletedialog, event.data.id)
        break;
      case 'editAction':
        this.openEditDialog(Editdialog, event.data)
        break;

    }
  }

}