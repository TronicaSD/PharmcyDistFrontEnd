import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from 'src/app/Service/Public.Service/public-service.service';
import { IStockDetails } from '../../interface/IStockDetails';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent implements OnInit {
  selectedItem = '0';
  StockDetails: any;
  closeResult: string;
  AddForm: FormGroup;
  EditForm: FormGroup;
  StockDetailsObject: IStockDetails = {
    drugName: "",
    id: 0,
    drugId: 0,
    quantity: 0

  };
  UpdateStockDetailsObject: IStockDetails =
    {
      drugName: "",
      id: 0,
      drugId: 0,
      quantity: 0
    };
  Drugs: any;
  constructor(private _PublicService: PublicService
    , private modalService: NgbModal
    , private _formbuilder: FormBuilder
  ) {

    this.AddForm = this._formbuilder.group({
      DrugId: ['', Validators.required],
      Quantity: ['', Validators.required],


    });

    this.EditForm = this._formbuilder.group({
      DrugId: ['', Validators.required],
      Quantity: ['', Validators.required],

    });
  }

  ngOnInit(): void {
    this.getAllStockDetails();
    this.getAllDrugs();
  }
  ClearData() {
    this.StockDetailsObject = {
      drugName: "",
      id: 0,
      drugId: 0,
      quantity: 0

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
  public hasError = (controlName: string, errorName: string) => {
    return this.AddForm.controls[controlName].hasError(errorName);
  };
  //add
  Add() {
    debugger;
    this._PublicService.Add('StockDetails', 'AddData', this.AddForm.value).subscribe((Response) => {
      this.modalService.dismissAll();
      this.getAllStockDetails();
      // this._ToasterService.FireMessagePopUp(1);
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.ClearData();
  }

  openAddModal(content: any) {

    this.modalService.open(content, { size:'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }
  //
  openEditModal(content: any, Id: any) {
    debugger;
    const result: IStockDetails = this.StockDetails.find(obj => obj.id === Id);
    this.StockDetailsObject = result;
    debugger;
    this.EditForm.controls['DrugId'].setValue(this.StockDetailsObject.drugId);
    this.EditForm.controls['Quantity'].setValue(this.StockDetailsObject.quantity);

    debugger;

    this.modalService.open(content, { size:'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }
  //Edit Modal
  updateStockDetails() {
    this.UpdateStockDetailsObject = {
      drugId: this.EditForm.value.DrugId,
      id: this.StockDetailsObject.id,
      quantity: this.EditForm.value.Quantity,
      drugName: ""

    }
    debugger;
    this._PublicService.Update('StockDetails', 'UpdateData', this.UpdateStockDetailsObject).subscribe((Response) => {
      this.StockDetails = Response;
      this.modalService.dismissAll();
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllStockDetails();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.ClearData();

  }


  //Delete Modal
  DeleteStockDetails(Object: any) {
    debugger;
    this._PublicService.Delete("StockDetails", 'DeleteData', Object.id).subscribe((Response) => {
      this.modalService.dismissAll();
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllStockDetails();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });

  }
  openDeleteModal(content: any, Object: any) {

    debugger;
    const result: IStockDetails = this.StockDetails.find((obj: any) => obj.id === Object.id);
    this.StockDetailsObject = result;
    debugger;

    this.modalService.open(content, { size:'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }



}
