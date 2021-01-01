import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from 'src/app/core/publicService.Service';
import { IStockDetails } from '../../interface/IStockDetails';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent implements OnInit {
  selectedItem = 1;
  StockDetails: any;
  closeResult: string;
  AddForm: FormGroup;
  EditForm: FormGroup;

  UpdateStockDetailsObject: IStockDetails =
    {
      drugName: "",
      id: 0,
      drugId: 0,
      quantity: 0
    };
  Drugs: any;
  constructor(private _PublicService: PublicService
    , private modalService: NbDialogService
    , private _formbuilder: FormBuilder
    , private dialogService: NbDialogService
    ,
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
    this.AddForm.reset();
    this.EditForm.reset();
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
  public hasError = (controlName: string, errorName: string) => {
    return this.AddForm.controls[controlName].hasError(errorName);
  };
  public hasEditError = (controlName: string, errorName: string) => {
    return this.EditForm.controls[controlName].hasError(errorName);
  };
  //add
  Add() {

    this._PublicService.post('StockDetails/AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllStockDetails();

      // this._ToasterService.FireMessagePopUp(1);
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.AddForm.reset();
  }

  openAddModal(dialog: TemplateRef<any>,) {
    this.dialogService.open(dialog, { backdropClass: "model-full" });

  }


  //
  openEditModal(dialog: any, row: IStockDetails) {



    this.EditForm.controls['DrugId'].setValue(row.drugId);
    this.EditForm.controls['Quantity'].setValue(row.quantity);



    this.dialogService.open(dialog, {});

  }
  //Edit Modal
  updateStockDetails() {


    this._PublicService.put('StockDetails/UpdateData', this.EditForm.value).subscribe((Response) => {
      this.StockDetails = Response;

      // this._ToasterService.FireMessagePopUp(1);
      this.getAllStockDetails();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.EditForm.reset();

  }


  //Delete Modal
  DeleteStockDetails(id: number) {

    this._PublicService.delete("StockDetailsDeleteData", id).subscribe((Response) => {

      // this._ToasterService.FireMessagePopUp(1);
      this.getAllStockDetails();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });

  }


  openDeleteModal(dialog: any, id: number) {


    this.dialogService.open(dialog, {
    }).onClose.subscribe(res => {
      if (res) {
        this.DeleteStockDetails(id);
      }


    });
  }



}
