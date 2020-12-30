import { Component, OnInit, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from 'src/app/Service/Public.Service/public-service.service';
import { ToasterService } from 'src/app/Service/Toaster.Service/toaster.service';
import { IDrug } from '../../interface/IDrug';

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
  DrugObject: IDrug = {
    drugName: "",
    id: 0
  };
  UpdateDrugObject: IDrug =
    {
      drugName: "",
      id: 0
    };
  constructor(private _PublicService: PublicService
    , private modalService: NgbModal
    , private _formbuilder: FormBuilder
  ) {

    this.AddForm = this._formbuilder.group({
      drugName: [null, Validators.required],

    });

    this.EditForm = this._formbuilder.group({
      drugName: [null, Validators.required],

    });
  }

  ngOnInit(): void {
    this.getAllDrugs();
  }


  ClearData() {
    this.DrugObject = {
      id: 0,
      drugName: ''
    }
  }
  getAllDrugs() {

    this._PublicService.getAll("Drug", 'ViewGetAll').subscribe(res => {
      this.Drugs = res;


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

    this._PublicService.Add('Drug', 'AddData', this.AddForm.value).subscribe((Response) => {
      this.modalService.dismissAll();
      this.getAllDrugs();
      this.AddForm.reset();
      // this._ToasterService.FireMessagePopUp(1);
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.AddForm.reset();
  }

  openAddModal(content: any) {

    this.modalService.open(content,
      {
        size: "lg",
        centered: false,
        backdrop: true,
        keyboard: false,
        backdropClass: "modal-backdrop"

      }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
      });
  }
  //
  openEditModal(content: any, Id: any) {
    const result: IDrug = this.Drugs.find(obj => obj.id === Id);
    this.DrugObject = result;
    this.EditForm.controls['drugName'].setValue(this.DrugObject.drugName);

    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }
  //Edit Modal
  updateDrug() {

    this.UpdateDrugObject = {
      drugName: this.EditForm.value.drugName,
      id: this.DrugObject.id
    }

    this._PublicService.Update('Drug', 'UpdateData', this.UpdateDrugObject).subscribe((Response) => {
      this.Drugs = Response;
      this.modalService.dismissAll();
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllDrugs();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.EditForm.reset();

  }


  //Delete Modal
  DeleteDrug(Object: any) {

    this._PublicService.Delete("Drug", 'DeleteData', Object.id).subscribe((Response) => {
      this.modalService.dismissAll();
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllDrugs();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });

  }
  openDeleteModal(content: any, Object: any) {


    const result: IDrug = this.Drugs.find((obj: any) => obj.id === Object.id);
    this.DrugObject = result;


    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }



} 