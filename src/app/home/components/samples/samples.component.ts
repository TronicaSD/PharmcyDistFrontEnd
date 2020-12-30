import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from 'src/app/Service/Public.Service/public-service.service';
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
  SampleObject: ISample = {
    drugName: "",
    id: 0,
    drugId: 0,
    qunantity: 0,
    doctorName: ""

  };
  UpdateSampleObject: ISample =
    {
      drugName: "",
      id: 0,
      drugId: 0,
      qunantity: 0,
      doctorName: ""
    };
  Drugs: any;
  StockDetails: Object;
  constructor(private _PublicService: PublicService
    , private dialogService: NbDialogService
    , private _formbuilder: FormBuilder
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

    });
  }

  ngOnInit(): void {
    this.getAllSample();
    this.getAllDrugs();
    this.getAllStockDetails();
  }
  ClearData() {
    this.SampleObject = {
      drugName: "",
      id: 0,
      drugId: 0,
      qunantity: 0,
      doctorName: ""
    }
  }
  getAllDrugs() {
    debugger;
    this._PublicService.getAll("Drug", 'ViewGetAll').subscribe(res => {
      this.Drugs = res;
      debugger;

    });
  }
  getAllStockDetails() {
    debugger;
    this._PublicService.getAll("StockDetails", 'ViewGetAll').subscribe(res => {
      this.StockDetails = res;
      debugger;

    });
  }
  getAllSample() {
    debugger;
    this._PublicService.getAll("Sample", 'ViewGetAll').subscribe(res => {
      this.Samples = res;
      debugger;

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
    this._PublicService.Add('Sample', 'AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllSample();
      // this._ToasterService.FireMessagePopUp(1);
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.AddForm.reset();
  }


  //
  openEditModal(dialog: TemplateRef<any>, Id: any) {
    const result: ISample = this.Samples.find(obj => obj.id === Id);
    this.SampleObject = result;
    this.EditForm.controls['DrugId'].setValue(this.SampleObject.drugId);
    this.EditForm.controls['qunantity'].setValue(this.SampleObject.qunantity);
    this.EditForm.controls['DoctorName'].setValue(this.SampleObject.doctorName);
    debugger;
    this.dialogService.open(dialog, {
      context: {
        title: "dd",
      }, dialogClass: 'model-full'
    });
  }
  //Edit Modal
  updateSample() {
    debugger;

    this.UpdateSampleObject = {
      drugId: this.EditForm.value.DrugId,
      id: this.SampleObject.id,
      qunantity: this.EditForm.value.qunantity,
      doctorName: this.EditForm.value.DoctorName,
      drugName: "",
    }

    debugger;
    this._PublicService.Update('Sample', 'UpdateData', this.UpdateSampleObject).subscribe((Response) => {
      this.Samples = Response;
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllSample();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.EditForm.reset();

  }


  ///////////////////////Delete Modal
  openDeleteModal(dialog: TemplateRef<any>, Object: any) {
    const result: ISample = this.Samples.find((obj: any) => obj.id === Object.id);
    this.SampleObject = result;
    this.dialogService.open(dialog, {
      context: {
        title: "dd",
      }, dialogClass: 'model-full'
    });
  }
  DeleteSample(Object: any) {
    debugger;
    this._PublicService.Delete("Sample", 'DeleteData', Object.id).subscribe((Response) => {
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllSample();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });

  }




}

