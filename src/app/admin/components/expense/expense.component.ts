import { ChangeDetectorRef, Component, OnInit, SkipSelf, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';
import * as XLSX from 'xlsx';
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
      userId: [null, Validators.required],
      expenseTypesId: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      description: [null],

    });

    this.EditForm = this._formbuilder.group({
      description: [null],
      userId: [null, Validators.required],
      expenseTypesId: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
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
    this.translate.get("Actions").subscribe(label => this.columnheaders[0] = label);
    this.translate.get("UserName").subscribe(label => this.columnheaders[1] = label);
    this.translate.get("ExpenseType").subscribe(label => this.columnheaders[2] = label);
    this.translate.get("Amount").subscribe(label => this.columnheaders[3] = label);
    this.translate.get("Description").subscribe(label => this.columnheaders[4] = label);
    this.translate.get("Date").subscribe(label => this.columnheaders[5] = label);

    this.loadTableSettings();

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
        expensesName: {
          title: this.columnheaders[2],
          type: 'string',
          filter: true
        },
        amount: {
          title: this.columnheaders[3],
          type: 'string',
          filter: false
        },
      
        date: {
          title: this.columnheaders[5],
          type: "string",
          width: '12%',
          filter: false,
          valuePrepareFunction: (dates) => {
            if (dates) {
              let date = new Date(dates);

              return date.getDate() + '-' + date.getMonth() + 1 + '-' + date.getFullYear();
            }
            return null;
          }
        },
        description: {
          title: this.columnheaders[4],
          type: 'string',
          filter: false,
        },
       
      }
    };
  }
  getAllExpenses() {

    this._PublicService.get("Expenses").subscribe(res => {
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

    this._PublicService.get("ExpenseTypes").subscribe(res => {
      this.ExpenseTypes = res;
      

    });
  }

  getAllUser() {

    this._PublicService.get("Users").subscribe(res => {
      this.Users = res;
      
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
      this.AddForm.value.date.getFullYear(),
      this.AddForm.value.date.getMonth(),
      this.AddForm.value.date.getDate()
    ));
    this.AddForm.controls.date.setValue(date);

    
    this._PublicService.post('Expenses', this.AddForm.value).subscribe((Response) => {
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
    this.EditForm.controls['userId'].setValue(row.userId);
    this.EditForm.controls['description'].setValue(row.description);
    this.EditForm.controls['expenseTypesId'].setValue(row.expenseTypesId);
   
    this.EditForm.controls['amount'].setValue(row.amount);
    this.EditForm.controls['date'].setValue(row.date);

    this.EditForm.controls['id'].setValue(row.id);

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    });
  }
  updateExpense() {
    let date =new Date(this.EditForm.value.date);
    let newdate= new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ));
    this.EditForm.controls.date.setValue(newdate);

    this._PublicService.put('Expenses', this.EditForm.value).subscribe((Response) => {
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

    this._PublicService.delete("Expenses", id).subscribe((Response) => {
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

  exportoExcel(): void {
    /* pass here the table id */
    let element = document.getElementById('expenses-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    ws['!cols'][5] = { hidden: true };

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, "expenses.xlsx");

  }

}