import { ChangeDetectorRef, Component, OnInit, SkipSelf, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class countryComponent implements OnInit {
  country: any;
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
      governorate_Name: [null, Validators.required],


    });

    this.EditForm = this._formbuilder.group({
      governorate_Name: [null, Validators.required],
      governorate_Id: [null],
    });
    this.currentLang = translate.currentLang;
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      // TODO This as a workaround.
      this._changeDetectorRef.detectChanges();
    });

  }

  ngOnInit(): void {
    this.getAllcountry();
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
    this.translate.get("Actions").subscribe(label => this.columnheaders[0] = label);
    this.translate.get("Name").subscribe(label => {
      this.columnheaders[1] = label;
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

        governorate_Name: {
          title: this.columnheaders[1],
          type: 'string',
          filter: true
        }
      }
    };
  }
  getAllcountry() {

    this._PublicService.get("GS_Governorate/ViewGetAll").subscribe(res => {
      this.country = res;

      this.source.load(this.country);


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

    this._PublicService.post('GS_Governorate/AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllcountry();

      this._ToasterService.success("Country Added successfully", "Success");

    }, (error) => {
      this._ToasterService.danger("Failed To add ", "Failed");

    });
    this.AddForm.reset();
  }



  /////////////Edit///////////

  //Edit Modal
  openEditDialog(dialog: TemplateRef<any>, row: any) {

    this.EditForm.controls['governorate_Name'].setValue(row.governorate_Name);
    this.EditForm.controls['governorate_Id'].setValue(row.governorate_Id);

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    });
  }
  updateCountry() {
    debugger;
    this._PublicService.put('GS_Governorate/UpdateData', this.EditForm.value).subscribe((Response) => {
      this.country = Response;
      this.modalService.dismissAll();
      this._ToasterService.success("Country Updated successfully", "Success");
      this.getAllcountry();
    }, (error) => {
      this._ToasterService.danger(" Failed To  Update ", "failed");

    });
    this.EditForm.reset();

  }



  //Delete Modal
  DeleteCountry(id: any) {

    this._PublicService.delete("GS_Governorate/DeleteData", id).subscribe((Response) => {
      this.modalService.dismissAll();
      this._ToasterService.success("Country Deleted successfully", "Success");

      this.getAllcountry();
    }, (error) => {
      this._ToasterService.danger("Sorry but this item related To another table ", "Failed");

    });

  }



  openDeletedialog(dialog: TemplateRef<any>, id: any) {

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"
    }).onClose.subscribe(res => {

      if (res) {

        this.DeleteCountry(id);
      }


    });
  }

  onCustomAction(Deletedialog: TemplateRef<any>, Editdialog: TemplateRef<any>, event) {

    switch (event.action) {
      case 'deleteAction':
        this.openDeletedialog(Deletedialog, event.data.governorate_Id)
        break;
      case 'editAction':
        this.openEditDialog(Editdialog, event.data)
        break;

    }
  }

}