import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';
@Component({
  selector: 'app-pharmcy',
  templateUrl: './pharmcy.component.html',
  styleUrls: ['./pharmcy.component.css']
})
export class PharmcyComponent implements OnInit {
  allCities: any;
  allGovernorates: any;
  Pharmcies: any;
  closeResult: string;
  AddForm: FormGroup;
  EditForm: FormGroup;
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  TName: string;
  Action: string;
  TStreetName: string;
  currentLang: string;
  columnheaders: string[];

  constructor(private _PublicService: PublicService
    , private _formbuilder: FormBuilder
    , private dialogService: NbDialogService
    , private _ToasterService: NbToastrService
    , private translate: TranslateService
    , private _changeDetectorRef: ChangeDetectorRef

  ) {

    this.AddForm = this._formbuilder.group({
      pharmcyName: ['', Validators.required],
      streetName: ['', Validators.required],

      cityId: ['', Validators.required],
      governerateId: [1, Validators.required],


    });
    this.EditForm = this._formbuilder.group({
      pharmcyName: ['', Validators.required],
      streetName: ['', Validators.required],
      id: ['', Validators.required],
      cityId: ['', Validators.required],
      governerateId: ['', Validators.required],
    });
    this.currentLang = translate.currentLang;
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      // TODO This as a workaround.
      this._changeDetectorRef.detectChanges();
    });
  }


  ngOnInit(): void {
    this.getAllPharmcies();
    this.setColumnheaders();
    this.getAllGovernorates();
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }
  setColumnheaders(): void {
    let Action = 'Action';
    let PharmcyName = 'PharmcyName';
    let StreetName = 'StreetName';

    this.columnheaders = ['', '', '']
    //Used TranslateService from @ngx-translate/core
    this.translate.get("Actions").subscribe(label => this.columnheaders[0] = label);
    this.translate.get(PharmcyName).subscribe(label => this.columnheaders[1] = label);
    this.translate.get("Government").subscribe(label => this.columnheaders[2] = label);
    this.translate.get("City").subscribe(label => this.columnheaders[3] = label);

    this.translate.get(StreetName).subscribe(label => {
      this.columnheaders[4] = label;
      this.loadTableSettings();
    });

  }
  loadTableSettings() {
    this.settings = {
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
      },

      columns: {
        pharmcyName: {
          title: this.columnheaders[1],
          type: 'string',
        filter: true

        },
        governerateName: {
          title: this.columnheaders[2],
          type: 'string',
          filter: true


        },
        cityName: {
          title: this.columnheaders[3],
          type: 'string',
          filter: true

        },

        streetName: {
          title: this.columnheaders[4],
          type: 'string',
          filter: false


        },

      }
    };
  }
  getAllGovernorates() {
    this._PublicService.get("Governorates").subscribe(res => {
      this.allGovernorates = res;

      this.changeCities(1);
    });
  }

  changeCities(id: number) {

    this._PublicService.getByID("Cities/GetByGovernorateId", id).subscribe(res => {
      this.allCities = res;
    });
  }


  getAllPharmcies() {
    this._PublicService.get("PharmciesViewGetAll",).subscribe(res => {
      this.Pharmcies = res;
      this.source.load(this.Pharmcies);

    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.AddForm.controls[controlName].hasError(errorName);
  };

  public hasEditError = (controlName: string, errorName: string) => {
    return this.EditForm.controls[controlName].hasError(errorName);
  };


  //add
  Add() {

    this._PublicService.post('Pharmcies', this.AddForm.value).subscribe((Response) => {
      this.getAllPharmcies();
      this._ToasterService.success(" Pharmcy added successfully");
    }, (error) => {
      this._ToasterService.danger("Failed to add");
    });
    this.AddForm.reset();
  }

  openAddModal(dialog: TemplateRef<any>) {

    this.dialogService.open(dialog, {
      dialogClass: "md-modal"

    });

  }
  //
  openEditModal(dialog: TemplateRef<any>, row: any) {

    this.EditForm.controls['pharmcyName'].setValue(row.pharmcyName);
    this.EditForm.controls['streetName'].setValue(row.streetName);
    this.EditForm.controls['id'].setValue(row.id);
    this.EditForm.controls['cityId'].setValue(row.cityId);
    this.EditForm.controls['governerateId'].setValue(row.governerateId);

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    });
  }
  //Edit Modal
  updatePharmcy() {


    this._PublicService.put('Pharmcies', this.EditForm.value).subscribe((Response) => {
      this.Pharmcies = Response;
      this._ToasterService.success(" Pharmcy Updated Successfully");

      this.getAllPharmcies();
    }, (error) => {
      this._ToasterService.danger(" Failed To Updated ");

    });
    this.EditForm.reset();

  }


  //Delete Modal
  DeletePharmcy(id: any) {

    this._PublicService.delete("Pharmcies", id).subscribe((Response) => {
      this._ToasterService.success(" Pharmcy Delted Successfully");

      this.getAllPharmcies();
    }, (error) => {
      this._ToasterService.danger(" Failed To Delte ");

    });

  }

  openDeleteModal(dialog: TemplateRef<any>, id: any) {



    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    }).onClose.subscribe(res => {

      if (res) {

        this.DeletePharmcy(id);
      }


    });
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
