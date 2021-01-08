import { ChangeDetectorRef, Component, OnInit, SkipSelf, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';

@Component({
  selector: 'app-drugs',
  templateUrl: './drugs.component.html',
  styleUrls: ['./drugs.component.css']
})
export class DrugsComponent implements OnInit {
  Drugs: any;
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
    , private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.AddForm = this._formbuilder.group({
      drugName: [null, Validators.required],

    });

    this.EditForm = this._formbuilder.group({
      drugName: [null, Validators.required],
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
    this.getAllDrugs();
    this.setColumnheaders();
    //LISTEN TO EVENTS
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }
  setColumnheaders(): void {
    let Action = 'Action';
    let Name = 'Name';

    this.columnheaders = ['', '', '']
    //Used TranslateService from @ngx-translate/core
    this.translate.get(Action).subscribe(label => this.columnheaders[0] = label);
    this.translate.get(Name).subscribe(label => {
      this.columnheaders[1] = label;
      this.loadTableSettings();
    });

  }
  loadTableSettings() {
    this.settings = {
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
        filter: true
      },

      columns: {

        drugName: {
          title: this.columnheaders[1],
          type: 'string',
          filter: true
        },

      }
    };
  }
  getAllDrugs() {

    this._PublicService.get("Drugs/ViewGetAll").subscribe(res => {
      this.Drugs = res;
      this.source.load(this.Drugs);


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

    this._PublicService.post('Drugs/AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllDrugs();

      this._ToasterService.success("Drug Added successfully", "Success");

    }, (error) => {
      this._ToasterService.danger("Failed To add ", "Failed");

    });
    this.AddForm.reset();
  }



  /////////////Edit///////////

  //Edit Modal
  openEditDialog(dialog: TemplateRef<any>, row: any) {

    this.EditForm.controls['drugName'].setValue(row.drugName);
    this.EditForm.controls['id'].setValue(row.id);

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    });
  }
  updateDrug() {
    this._PublicService.put('Drugs/UpdateData', this.EditForm.value).subscribe((Response) => {
      this.Drugs = Response;
      this.modalService.dismissAll();
      this._ToasterService.success("Drug Updated successfully", "Success");
      this.getAllDrugs();
    }, (error) => {
      this._ToasterService.danger(" Failed To  Update ", "failed");

    });
    this.EditForm.reset();

  }



  //Delete Modal
  DeleteDrug(id: any) {

    this._PublicService.delete("Drugs/DeleteData", id).subscribe((Response) => {
      this.modalService.dismissAll();
      this._ToasterService.success("Drug Deleted successfully", "Success");

      this.getAllDrugs();
    }, (error) => {
      this._ToasterService.danger("Failed To Delete ", "Failed");

    });

  }



  openDeletedialog(dialog: TemplateRef<any>, id: any) {

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"
    }).onClose.subscribe(res => {

      if (res) {

        this.DeleteDrug(id);
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