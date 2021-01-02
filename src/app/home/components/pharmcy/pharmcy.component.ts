import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';
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
      },
      pharmcyName: {
        title: 'Pharmcy Name',
        type: 'string',
      },

      address: {
        title: 'address',
        type: 'string',
      },

    }
  };
  source: LocalDataSource = new LocalDataSource();

  constructor(private _PublicService: PublicService
    , private _formbuilder: FormBuilder
    , private dialogService: NbDialogService
    , private _ToasterService: NbToastrService

  ) {

    this.AddForm = this._formbuilder.group({
      pharmcyName: ['', Validators.required],
      address: ['', Validators.required],


    });

    this.EditForm = this._formbuilder.group({
      pharmcyName: ['', Validators.required],
      address: ['', Validators.required],
      id: [''],
    });
  }

  ngOnInit(): void {
    this.getAllPharmcies();
  }

  getAllPharmcies() {
    this._PublicService.get("Pharmcy/ViewGetAll",).subscribe(res => {
      this.Pharmcies = res;
      this.source.load(this.Pharmcies);

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

    this._PublicService.post('Pharmcy/AddData', this.AddForm.value).subscribe((Response) => {
      this.getAllPharmcies();
      this._ToasterService.success(" Pharmcy added successfully");
    }, (error) => {
      this._ToasterService.danger("Failed to add");
    });
    this.AddForm.reset();
  }

  openAddModal(dialog: TemplateRef<any>) {

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    });

  }
  //
  openEditModal(dialog: TemplateRef<any>, row: any) {

    console.log(row);
    this.EditForm.controls['pharmcyName'].setValue(row.pharmcyName);
    this.EditForm.controls['address'].setValue(row.address);
    this.EditForm.controls['id'].setValue(row.id);

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    });
  }
  //Edit Modal
  updatePharmcy() {


    this._PublicService.put('Pharmcy/UpdateData', this.EditForm.value).subscribe((Response) => {
      this.Pharmcies = Response;
      this._ToasterService.success(" Pharmcy Updated Successfully");

      this.getAllPharmcies();
    }, (error) => {
      this._ToasterService.danger(" Failed To Updated ");

    });
    this.EditForm.reset();

  }


  //Delete Modal
  DeletePharmcy(id: any) {

    this._PublicService.delete("Pharmcy/DeleteData", id).subscribe((Response) => {
      this._ToasterService.success(" Pharmcy Delted Successfully");

      this.getAllPharmcies();
    }, (error) => {
      this._ToasterService.danger(" Failed To Delte ");

    });

  }

  openDeleteModal(dialog: TemplateRef<any>, id: any) {



    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    }).onClose.subscribe(res => {
      debugger;
      if (res) {
        debugger;
        this.DeletePharmcy(id);
      }


    });
  }

  onCustomAction(Deletedialog: TemplateRef<any>, Editdialog: TemplateRef<any>, event) {
    debugger;
    switch (event.action) {
      case 'deleteAction':
        this.openDeleteModal(Deletedialog, event.data.id)
        break;
      case 'editAction':
        this.openEditModal(Editdialog, event.data)
        break;

    }
  }


}
