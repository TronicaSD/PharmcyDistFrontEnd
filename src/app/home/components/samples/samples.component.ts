import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  settings = {
    hideSubHeader: true,
    actions: {
      custom: [

        {
          name: 'editAction',
          title: '<i class="fa fa-edit text-warning"></i>'
        },
        {
          name: 'deleteAction',
           title:'<i class="fa fa-trash text-danger"></i>'
        }
      ],
      add: false,
      edit: false,
      delete: false
    },

    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      doctorName: {
        title: 'Doctor Name',
        type: 'string',
      },
      drugName: {
        title: 'Drug Name',
        type: 'string',
      },
      qunantity: {
        title: 'Qunantity',
        type: 'string',
      },

    }
  };
  source: LocalDataSource = new LocalDataSource();

  Drugs: any;
  StockDetails: any;
  constructor(private _PublicService: PublicService
    , private dialogService: NbDialogService
    , private _formbuilder: FormBuilder,
    private _ToasterService: NbToastrService
  ) {

    this.AddForm = this._formbuilder.group({
      DrugId: ['', Validators.required],
      qunantity: ['', Validators.required],
      DoctorName: ['', Validators.required],



    });

    this.EditForm = this._formbuilder.group({
      DrugId: ['', Validators.required],
      qunantity: ['', Validators.required],
      DoctorName: ['', Validators.required],
      id: [''],
    });
  }

  ngOnInit(): void {
    this.getAllSample();
    this.getAllDrugs();
    this.getAllStockDetails();
  }
  ClearData() {
    this.AddForm.reset();

  }
  getAllDrugs() {
    this._PublicService.get("Drug/ViewGetAll").subscribe(res => {
      this.Drugs = res;

    });
  }
  getAllStockDetails() {
    this._PublicService.get("StockDetails/ViewGetAll").subscribe(res => {
      this.StockDetails = res;

    });
  }
  getAllSample() {
    this._PublicService.get("Sample/ViewGetAll").subscribe(res => {
      this.Samples = res;
      debugger;
      this.source.load(this.Samples);

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
    debugger;
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

    this.EditForm.controls['DrugId'].setValue(row.drugId);
    this.EditForm.controls['qunantity'].setValue(row.qunantity);
    this.EditForm.controls['DoctorName'].setValue(row.doctorName);
    this.EditForm.controls['id'].setValue(row.id);

    this.dialogService.open(dialog, {

    });
  }
  updateSample() {

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
      debugger;
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

  onCustomAction(Deletedialog: TemplateRef<any>, Editdialog: TemplateRef<any>, event) {
    debugger;
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

