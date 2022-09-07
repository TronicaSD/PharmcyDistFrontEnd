import { ChangeDetectorRef, Component, OnInit, SkipSelf, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class doctorsComponent implements OnInit {
  Doctors: any;
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
      name: [null, Validators.required],
      phoneNumber: [null, [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],
      genderType: [null, Validators.required],
    });

    this.EditForm = this._formbuilder.group({
      name: [null, Validators.required],
      phoneNumber: [null, [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],
      genderType: [null, Validators.required],
      isDeleted: [null],
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
    this.getAllDoctors();
    this.setColumnheaders();
    //LISTEN TO EVENTS
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }
  setColumnheaders(): void {
    let Action = 'Action';
    let Name = 'Name';
    let Price = 'Price';

    this.columnheaders = ['', '', '']
    //Used TranslateService from @ngx-translate/core
    this.translate.get("Actions").subscribe(label => this.columnheaders[0] = label);
    this.translate.get("Name").subscribe(label => this.columnheaders[1] = label);
    this.translate.get("phoneNumber").subscribe(label => this.columnheaders[2] = label);
    this.translate.get("genderType").subscribe(label => {
      this.columnheaders[3] = label;
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

        name: {
          title: this.columnheaders[1],
          type: 'string',
          filter: false
        },
        phoneNumber: {
          title: this.columnheaders[2],
          type: 'string',
          filter: false
        },
        genderName: {
          title: this.columnheaders[3],
          type: 'string',
          filter: false
        }
      }
    };
  }
  getAllDoctors() {

    this._PublicService.get("Doctors").subscribe(res => {
      this.Doctors = res;
      this.source.load(this.Doctors);


    });
  }
  public hasError = (controlName: string, errorName: string) => {

    if (controlName==='phoneNumber') {
      return this.AddForm.controls[controlName].valid;
    }
    return this.AddForm.controls[controlName].hasError(errorName);

  };

  public hasEditError = (controlName: string, errorName: string) => {
    
    if (controlName==='phoneNumber') {
      return this.EditForm.controls[controlName].valid;
    }
    return this.EditForm.controls[controlName].hasError(errorName);
  };


  ////////////////add/////////////
  openAddDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"
    });
  }
  Add() {

    this._PublicService.post('Doctors', this.AddForm.value).subscribe((Response) => {
      this.getAllDoctors();

      this._ToasterService.success("Doctor Added successfully", "Success");

    }, (error) => {
      this._ToasterService.danger("Failed To add ", "Failed");

    });
    this.AddForm.reset();
  }



  /////////////Edit///////////

  //Edit Modal
  openEditDialog(dialog: TemplateRef<any>, row: any) {
    this.EditForm.controls['name'].setValue(row.name);
    this.EditForm.controls['phoneNumber'].setValue(row.phoneNumber);
    this.EditForm.controls['genderType'].setValue(row.genderType);
    this.EditForm.controls['id'].setValue(row.id);

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    });
  }
  updateDoctor() {
    this.EditForm.controls['isDeleted'].setValue(false);

    this._PublicService.put('Doctors', this.EditForm.value).subscribe((Response) => {
      this.Doctors = Response;
      this.modalService.dismissAll();
      this._ToasterService.success("Doctor Updated successfully", "Success");
      this.getAllDoctors();
    }, (error) => {
      this._ToasterService.danger(" Failed To  Update ", "failed");

    });
    this.EditForm.reset();

  }



  //Delete Modal
  DeleteDoctor(id: any) {

    this._PublicService.delete("Doctors", id).subscribe((Response) => {
      this.modalService.dismissAll();
      this._ToasterService.success("Doctor Deleted successfully", "Success");

      this.getAllDoctors();
    }, (error) => {
      this._ToasterService.danger("Sorry but this item related To another table ", "Failed");

    });

  }



  openDeletedialog(dialog: TemplateRef<any>, id: any) {

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"
    }).onClose.subscribe(res => {

      if (res) {

        this.DeleteDoctor(id);
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