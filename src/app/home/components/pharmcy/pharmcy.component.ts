import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from 'src/app/Service/Public.Service/public-service.service';
import { ToasterService } from 'src/app/Service/Toaster.Service/toaster.service';
import { IPharmcy } from '../../interface/IPharmcy';
@Component({
  selector: 'app-pharmcy',
  templateUrl: './pharmcy.component.html',
  styleUrls: ['./pharmcy.component.css']
})
export class PharmcyComponent implements OnInit {

  Pharmcies: any;
  closeResult: string;
  AddForm: FormGroup;
  EditForm: FormGroup;

  constructor(private _PublicService: PublicService
    , private _formbuilder: FormBuilder
    , private dialogService: NbDialogService

  ) {

    this.AddForm = this._formbuilder.group({
      pharmcyName: ['', Validators.required],
      address: ['', Validators.required],


    });

    this.EditForm = this._formbuilder.group({
      pharmcyName: ['', Validators.required],
      address: ['', Validators.required],

    });
  }

  ngOnInit(): void {
    this.getAllPharmcies();
  }

  getAllPharmcies() {
    this._PublicService.getAll("Pharmcy", 'ViewGetAll').subscribe(res => {
      this.Pharmcies = res;

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

    this._PublicService.Add('Pharmcy', 'AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllPharmcies();
      // this._ToasterService.FireMessagePopUp(1);
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.AddForm.reset();
  }

  openAddModal(dialog: TemplateRef<any>) {

    this.dialogService.open(dialog, { backdropClass: "model-full" });

  }
  //
  openEditModal(dialog: TemplateRef<any>, row: any) {

    console.log(row);
    this.EditForm.controls['pharmcyName'].setValue(row.pharmcyName);
    this.EditForm.controls['address'].setValue(row.address);

    this.dialogService.open(dialog, {
    });
  }
  //Edit Modal
  updatePharmcy() {


    this._PublicService.Update('Pharmcy', 'UpdateData', this.EditForm.value).subscribe((Response) => {
      this.Pharmcies = Response;
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllPharmcies();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.EditForm.reset();

  }


  //Delete Modal
  DeletePharmcy(Object: any) {

    this._PublicService.Delete("Pharmcy", 'DeleteData', Object.id).subscribe((Response) => {
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllPharmcies();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });

  }

  openDeleteModal(dialog: TemplateRef<any>, Object: any) {



    this.dialogService.open(dialog, {

    });
  }



}
