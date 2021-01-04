import { Component, OnInit, SkipSelf, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';

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
  settings = {
    hideSubHeader: true,
    actions: {
      custom: [

        {
          name: 'editAction',
          title: 'edit'
        },
        {
          name: 'deleteAction',
          title: 'delete'
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
        filter: true

      },
      drugName: {
        title: 'Drug Name',
        type: 'string',
        filter: true
      },

    }
  };
  source: LocalDataSource = new LocalDataSource();

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
      id: [null],
    });
    this.getAllDrugs();
  }

  ngOnInit(): void {

  }

  getAllDrugs() {

    this._PublicService.get("Drug/ViewGetAll").subscribe(res => {
      this.Drugs = res;
      this.source.load(this.Drugs);

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
    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"
    });
  }
  Add() {

    this._PublicService.post('Drug/AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllDrugs();

      this._ToasterService.success("Drug Added successfully", "Success");

    }, (error) => {
      this._ToasterService.danger("Failed To add ", "Failed");

    });
    this.AddForm.reset();
  }



  /////////////Edit///////////

  //Edit Modal
  openEditDialog(dialog: TemplateRef<any>, row: any) {

    this.EditForm.controls['drugName'].setValue(row.drugName);
    this.EditForm.controls['id'].setValue(row.id);

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    });
  }
  updateDrug() {
    this._PublicService.put('Drug/UpdateData', this.EditForm.value).subscribe((Response) => {
      this.Drugs = Response;
      this.modalService.dismissAll();
      this._ToasterService.success("Drug Updated successfully", "Success");
      this.getAllDrugs();
    }, (error) => {
      this._ToasterService.danger(" Failed To  Update ", "failed");

    });
    this.EditForm.reset();

  }



  //Delete Modal
  DeleteDrug(id: any) {

    this._PublicService.delete("Drug/DeleteData", id).subscribe((Response) => {
      this.modalService.dismissAll();
      this._ToasterService.success("Drug Deleted successfully", "Success");

      this.getAllDrugs();
    }, (error) => {
      this._ToasterService.danger("Failed To Delete ", "Failed");

    });

  }



  openDeletedialog(dialog: TemplateRef<any>, id: any) {
    debugger;
    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"
    }).onClose.subscribe(res => {
      debugger;
      if (res) {
        debugger;
        this.DeleteDrug(id);
      }


    });
  }

  onCustomAction(Deletedialog: TemplateRef<any>, Editdialog: TemplateRef<any>, event) {
    debugger;
    switch (event.action) {
      case 'deleteAction':
        this.openDeletedialog(Deletedialog, event.data.id)
        break;
      case 'editAction':
        this.openEditDialog(Editdialog, event.data)
        break;

    }
  }

}