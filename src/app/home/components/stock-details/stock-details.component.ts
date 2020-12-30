import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from 'src/app/Service/Public.Service/public-service.service';
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
    this._PublicService.getAll("Drug", 'ViewGetAll').subscribe(res => {
      this.Drugs = res;
    });
  }
  getAllStockDetails() {
    this._PublicService.getAll("StockDetails", 'ViewGetAll').subscribe(res => {
      this.StockDetails = res;

    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.AddForm.controls[controlName].hasError(errorName);
  };
  //add
  Add() {
   
    this._PublicService.Add('StockDetails', 'AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllStockDetails();
      
      // this._ToasterService.FireMessagePopUp(1);
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.ClearData();
  }

  openAddModal(content: any) {

    this.modalService.open(content, {}

    );
  }

 
  //
  openEditModal(content: any, row: IStockDetails) {
   

   
    this.EditForm.controls['DrugId'].setValue(row.drugId);
    this.EditForm.controls['Quantity'].setValue(row.quantity);

   

    this.modalService.open(content,{} );
    
  }
  //Edit Modal
  updateStockDetails() {
  
   
    this._PublicService.Update('StockDetails', 'UpdateData', this.EditForm.value).subscribe((Response) => {
      this.StockDetails = Response;
    
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllStockDetails();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });
    this.ClearData();

  }


  //Delete Modal
  DeleteStockDetails(id: number) {
   
    this._PublicService.Delete("StockDetails", 'DeleteData',id).subscribe((Response) => {
    
      // this._ToasterService.FireMessagePopUp(1);
      this.getAllStockDetails();
    }, (error) => {
      // this._ToasterService.FireMessagePopUp(2);
    });

  }


  openDeleteModal(content: any, id: number) {

   
    this.modalService.open(content, {
   }).onClose.subscribe(res=>{
      if(res){
        this.DeleteStockDetails(id);
      }


    });
  }



}
