import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
 
  Drugs: any;
  StockDetails: Object;
  constructor(private _PublicService: PublicService
    , private dialogService: NbDialogService
    , private _formbuilder: FormBuilder,
    private _ToasterService:NbToastrService
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
      this._ToasterService.danger("Sample failed to add");

    });
    this.AddForm.reset();
  }


  //
  openEditModal(dialog: TemplateRef<any>, obj: any) {
 
    this.EditForm.controls['DrugId'].setValue(obj.drugId);
    this.EditForm.controls['qunantity'].setValue(obj.qunantity);
    this.EditForm.controls['DoctorName'].setValue(obj.doctorName);
    this.dialogService.open(dialog, {
    
    });
  }
  //Edit Modal
  updateSample() {

    this._PublicService.put('Sample/UpdateData', this.EditForm.value).subscribe((Response) => {
      this.Samples = Response;
       this._ToasterService.success("Sample updated Successfully");
      this.getAllSample();
    }, (error) => {
      this._ToasterService.danger("Failed to update");


    });
    this.EditForm.reset();

  }


  ///////////////////////Delete Modal
  openDeleteModal(dialog: TemplateRef<any>, id: any) {

    this.dialogService.open(dialog, {
  
    });
  }
  DeleteSample(id: number) {
    this._PublicService.delete("SampleDeleteData", id).subscribe((Response) => {
      this._ToasterService.success("sample Delted successfully");
      this.getAllSample();
    }, (error) => {
       this._ToasterService.danger("Failed to delete");
    });

  }




}

