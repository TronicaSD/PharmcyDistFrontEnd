import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';
import { ISample } from '../../interface/ISample';

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.css']
})
export class SamplesComponent implements OnInit {

  selectedItem = '0';
  Samples: any;
  closeResult: string;
  AddForm: FormGroup;
  EditForm: FormGroup;
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  StockDrugs: any;
  Action: string;
  columnheaders: string[];
  loading = true;
  defaultDate: any;
  Doctors: any[];
  constructor(private _PublicService: PublicService
    , private dialogService: NbDialogService
    , private _formbuilder: FormBuilder,
    private _ToasterService: NbToastrService
    , private translate: TranslateService
  ) {



  }

  ngOnInit(): void {
    this.AddForm = this._formbuilder.group({
      drugId: ['', Validators.required],
      qunantity: ['', Validators.required],
      doctorId: ['', Validators.required],
      date: [new Date(), Validators.required],



    });

    this.EditForm = this._formbuilder.group({
      drugId: [0, Validators.required],
      qunantity: ['', Validators.required],
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      id: [''],
    });
    this.getAllDoctors();
    this.setColumnheaders();
    this.getAllSample();

    this.getAllStockDetails();

    //LISTEN TO EVENTS
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }
  setColumnheaders() {
    this.columnheaders = []
    //Used TranslateService from @ngx-translate/core
    this.translate.get('Action').subscribe(label => this.columnheaders[0] = label);
    this.translate.get('DoctorName').subscribe(label => this.columnheaders[1] = label);
    this.translate.get('DrugName').subscribe(label => this.columnheaders[2] = label);
    this.translate.get('Date').subscribe(label => this.columnheaders[3] = label);

    this.translate.get('Quantity').subscribe(label => {
      this.columnheaders[4] = label;
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
      },

      columns: {
        doctorName: {
          title: this.columnheaders[1],
          type: 'string',
          filter: true


        },
        drugName: {
          title: this.columnheaders[2],
          type: 'string',
          filter: true

        },
        date: {
          title: this.columnheaders[3],
          type: 'string',
          filter: false,

          valuePrepareFunction: (date) => {
            if (date) {
              let dates = new Date(date);

              return dates.getDate() + '-' + dates.getMonth() + 1 + '-' + dates.getFullYear();
            }
            return null;
          }
        },
        qunantity: {
          title: this.columnheaders[4],
          type: 'string',
          filter: false,

        },

      }
    };
  }

  ClearData() {
    this.AddForm.reset();

  }

  getAllStockDetails() {
    this._PublicService.get("StockDetails/ViewGetAll").subscribe(res => {
      this.StockDrugs = res;

    });
  }

  getAllSample() {
    this._PublicService.get("Sample/ViewGetAll").subscribe(res => {
      this.Samples = res;
      this.source.load(this.Samples);
      this.loading = false;
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.AddForm.controls[controlName].hasError(errorName);
  };
  public hasEditError = (controlName: string, errorName: string) => {
    return this.EditForm.controls[controlName].hasError(errorName);
  };
  ////////////////////add
  openAddModal(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { backdropClass: "model-full" });

  }
  Add() {
    let date = new Date(Date.UTC(
      this.AddForm.value.date.getFullYear(),
      this.AddForm.value.date.getMonth(),
      this.AddForm.value.date.getDate()
    ));
    this.AddForm.controls.date.setValue(date);

    this._PublicService.post('Sample/AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllSample();
      this._ToasterService.success("Sample added successfully");
    }, (error) => {
      this._ToasterService.danger("The quantity is less than that in stock", "Failed");

    });
    this.AddForm.reset();
  }


  ////////////Edit Modal//////////
  openEditModal(dialog: TemplateRef<any>, row: any) {

    this.EditForm.controls['drugId'].setValue(row.drugId);
    this.EditForm.controls['qunantity'].setValue(row.qunantity);
    this.EditForm.controls['doctorId'].setValue(row.doctorId);
    this.EditForm.controls['date'].setValue(new Date(row.date));
    this.EditForm.controls['id'].setValue(row.id);

    this.dialogService.open(dialog, {

    });
  }
  updateSample() {
    let date = new Date(Date.UTC(
      this.EditForm.value.date.getFullYear(),
      this.EditForm.value.date.getMonth(),
      this.EditForm.value.date.getDate()
    ));
    this.EditForm.controls.date.setValue(date);
    this._PublicService.put('Sample/UpdateData', this.EditForm.value).subscribe((Response) => {
      this.Samples = Response;
      this._ToasterService.success("Sample updated Successfully");
      this.getAllSample();
    }, (error) => {
      this._ToasterService.danger("The quantity is less than that in stock", "Failed");


    });
    this.EditForm.reset();

  }


  ///////////////////////Delete Modal
  openDeleteModal(dialog: TemplateRef<any>, id: any) {
    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    }).onClose.subscribe(res => {

      if (res) {

        this.DeleteSample(id);
      }


    });
  }
  DeleteSample(id: number) {
    this._PublicService.delete("Sample/DeleteData", id).subscribe((Response) => {
      this._ToasterService.success("sample Delted successfully");
      this.getAllSample();
    }, (error) => {
      this._ToasterService.danger("Failed to delete");
    });

  }
  getAllDoctors() {

    this._PublicService.get("Doctors/ViewGetAll").subscribe(res => {
      this.Doctors = res;


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

