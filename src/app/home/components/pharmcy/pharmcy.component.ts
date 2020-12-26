import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  PharmcyObject: IPharmcy = {
    pharmcyName: "",
    id: 0,
    address: ""

  };
  UpdatePharmcyObject: IPharmcy =
    {
      pharmcyName: "",
      id: 0,
      address: ""
    };
  constructor(private _PublicService: PublicService
    , private modalService: NgbModal
    , private _formbuilder: FormBuilder
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
  ClearData() {
    this.PharmcyObject = {
      id: 0,
      pharmcyName: '',
      address: ""

    }
  }
  getAllPharmcies() {
    debugger;
    this._PublicService.getAll("Pharmcy", 'ViewGetAll').subscribe(res => {
      this.Pharmcies = res;
      debugger;

    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.AddForm.controls[controlName].hasError(errorName);
  };
  //add
  Add() {
    debugger;
    this._PublicService.Add('Pharmcy', 'AddData', this.AddForm.value).subscribe((Response) => {
      this.modalService.dismissAll();
      this.getAllPharmcies();
      // this._ToasterService.FireMessagePopUp(1);
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.ClearData();
  }

  openAddModal(content: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }
  //
  openEditModal(content: any, Id: any) {
    debugger;
    const result: IPharmcy = this.Pharmcies.find(obj => obj.id === Id);
    this.PharmcyObject = result;
    debugger;
    this.EditForm.controls['pharmcyName'].setValue(this.PharmcyObject.pharmcyName);
    this.EditForm.controls['address'].setValue(this.PharmcyObject.address);

    debugger;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }
  //Edit Modal
  updatePharmcy() {
    debugger;
    this.UpdatePharmcyObject = {
      pharmcyName: this.EditForm.value.pharmcyName,
      id: this.PharmcyObject.id,
      address: this.EditForm.value.address

    }
    debugger;
    this._PublicService.Update('Pharmcy', 'UpdateData', this.UpdatePharmcyObject).subscribe((Response) => {
      this.Pharmcies = Response;
      this.modalService.dismissAll();
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllPharmcies();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.ClearData();

  }


  //Delete Modal
  DeletePharmcy(Object: any) {
    debugger;
    this._PublicService.Delete("Pharmcy", 'DeleteData', Object.id).subscribe((Response) => {
      this.modalService.dismissAll();
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllPharmcies();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });

  }
  openDeleteModal(content: any, Object: any) {

    debugger;
    const result: IPharmcy = this.Pharmcies.find((obj: any) => obj.id === Object.id);
    this.PharmcyObject = result;
    debugger;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }



}