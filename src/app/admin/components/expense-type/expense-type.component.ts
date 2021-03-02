import { ChangeDetectorRef, Component, OnInit, SkipSelf, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';

@Component({
  selector: 'app-expense-type',
  templateUrl: './expense-type.component.html',
  styleUrls: ['./expense-type.component.css']
})
export class ExpenseTypeComponent implements OnInit {
  ExpenseTypes: any;
  closeResult: string;
  AddForm: FormGroup;
  EditForm: FormGroup;
  TName: string = "";
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  Action: string;
  currentLang: string;
  columnheaders: string[];
  constructor(private _PublicService: PublicService
    , private modalService: NgbModal
    , private _formbuilder: FormBuilder
    , private dialogService: NbDialogService
    , private _ToasterService: NbToastrService
    , private translate: TranslateService
    , private _changeDetectorRef: ChangeDetectorRef) {
    this.AddForm = this._formbuilder.group({
      expensesName: ['', Validators.required],
      description: [''],



    });

    this.EditForm = this._formbuilder.group({
      expensesName: ['', Validators.required],
      description: [''],
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
    this.getAllExpenseTypes();
    this.setColumnheaders();
    //LISTEN TO EVENTS
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }
  setColumnheaders(): void {
    this.columnheaders = ['', '', '']
    //Used TranslateService from @ngx-translate/core
    this.translate.get("Action").subscribe(label => this.columnheaders[0] = label);
    this.translate.get("Description").subscribe(label => this.columnheaders[1] = label);
    this.translate.get("Name").subscribe(label => {
      this.columnheaders[2] = label;
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
        expensesName: {
          title: this.columnheaders[2],
          type: 'string',
          filter: true
        },
        description: {
          title: this.columnheaders[1],
          type: 'string',
          filter: false
        },
    
      }
    };
  }
  getAllExpenseTypes() {
    this._PublicService.get("ExpenseTypes/ViewGetAll").subscribe(res => {
      this.ExpenseTypes = res;
      console.log(res);
      this.source.load(this.ExpenseTypes);


    });
  }
  public hasError = (controlName: string, errorName: string) => {

    return this.AddForm.controls[controlName].hasError(errorName);
  };

  public hasEditError = (controlName: string, errorName: string) => {

    return this.EditForm.controls[controlName].hasError(errorName);
  };


  ////////////////add/////////////
  openAddDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"
    });
  }
  Add() {

    this._PublicService.post('ExpenseTypes/AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllExpenseTypes();

      this._ToasterService.success("ExpenseType Added successfully", "Success");

    }, (error) => {
      this._ToasterService.danger("Failed To add ", "Failed");

    });
    this.AddForm.reset();
  }



  /////////////Edit///////////

  //Edit Modal
  openEditDialog(dialog: TemplateRef<any>, row: any) {
    this.EditForm.controls['id'].setValue(row.id);
    this.EditForm.controls['expensesName'].setValue(row.expensesName);
    this.EditForm.controls['description'].setValue(row.description);


    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    });
  }
  updateExpenseType() {
    this._PublicService.put('ExpenseTypes/UpdateData', this.EditForm.value).subscribe((Response) => {
      this.ExpenseTypes = Response;
      this.modalService.dismissAll();
      this._ToasterService.success("ExpenseType Updated successfully", "Success");
      this.getAllExpenseTypes();
    }, (error) => {
      this._ToasterService.danger(" Failed To  Update ", "failed");

    });
    this.EditForm.reset();

  }



  //Delete Modal
  DeleteExpenseType(id: any) {

    this._PublicService.delete("ExpenseTypes/DeleteData", id).subscribe((Response) => {
      this.modalService.dismissAll();
      this._ToasterService.success("ExpenseType Deleted successfully", "Success");

      this.getAllExpenseTypes();
    }, (error) => {
      this._ToasterService.danger("Sorry but this item related To another table ", "Failed");

    });

  }



  openDeletedialog(dialog: TemplateRef<any>, id: any) {

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"
    }).onClose.subscribe(res => {

      if (res) {

        this.DeleteExpenseType(id);
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