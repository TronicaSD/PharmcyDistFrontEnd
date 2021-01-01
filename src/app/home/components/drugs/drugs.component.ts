import { Component, OnInit, SkipSelf, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from 'src/app/core/publicService.Service';

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
    , private dialogService: NbDialogService
    , private _ToasterService: NbToastrService
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

    this._PublicService.get("Drug/ViewGetAll").subscribe(res => {
      this.Drugs = res;


    });
  }
  public hasError = (controlName: string, errorName: string) => {

    return this.AddForm.controls[controlName].hasError(errorName);
  };

  public hasEditError = (controlName: string, errorName: string) => {

    return this.EditForm.controls[controlName].hasError(errorName);
  };


  ////////////////add/////////////
  openAddDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { dialogClass:"defaultdialogue"
  });
  }
  Add() {

    this._PublicService.post('Drug/AddData',this.AddForm.value).subscribe((Response) => {
      this.getAllDrugs();

      this._ToasterService.success("Drug Added successfully","Success");

    }, (error) => {
    });
    this.AddForm.reset();
  }



  /////////////Edit///////////

  //Edit Modal
  openEditDialog(dialog: TemplateRef<any>, Id: any) {
    const result: IDrug = this.Drugs.find(obj => obj.id === Id);
    this.DrugObject = result;
    this.EditForm.controls['drugName'].setValue(this.DrugObject.drugName);

    this.dialogService.open(dialog, {
      dialogClass:"defaultdialogue"
    
    });
  }
  updateDrug() {

    this.UpdateDrugObject = {
      drugName: this.EditForm.value.drugName,
      id: this.DrugObject.id
    }

    this._PublicService.put('Drug/UpdateData', this.UpdateDrugObject).subscribe((Response) => {
      this.Drugs = Response;
      this.modalService.dismissAll();
      this._ToasterService.success("Drug Updated successfully","Success");
      this.getAllDrugs();
    }, (error) => {
      this._ToasterService.danger(" Failed To  Update ","failed");

    });
    this.EditForm.reset();

  }


  //Delete Modal
  DeleteDrug(Object: any) {

    this._PublicService.delete("Drug/DeleteData", Object.id).subscribe((Response) => {
      this.modalService.dismissAll();
      this._ToasterService.success("Drug Deleted successfully","Success");

      this.getAllDrugs();
    }, (error) => {
      this._ToasterService.danger("Failed To Delete ","Failed");

    });

  }



  openDeletedialog(dialog: TemplateRef<any>, Object: any) {

    const result: IDrug = this.Drugs.find((obj: any) => obj.id === Object.id);
    this.DrugObject = result;

    this.dialogService.open(dialog, {
      dialogClass:"defaultdialogue"

    
    });
  }
} 