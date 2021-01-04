import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
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
  settings: any;
  source: LocalDataSource = new LocalDataSource();

  Drugs: any;
  TQuantity: string;
  Action: string;
  TDrug: string;
  constructor(private _PublicService: PublicService
    , private modalService: NbDialogService
    , private _formbuilder: FormBuilder
    , private dialogService: NbDialogService
    , private _ToasterService: NbToastrService
    , private translate: TranslateService

  ) {

    this.AddForm = this._formbuilder.group({
      DrugId: ['', Validators.required],
      Quantity: ['', Validators.required],
    });

    this.EditForm = this._formbuilder.group({
      DrugId: ['', Validators.required],
      Quantity: ['', Validators.required],
      id: [''],
    });
    this.translate.get('Drug').subscribe((text: string) => {
      this.TDrug = text;
    })
    this.translate.get('Action').subscribe((text: string) => {
      this.Action = text;
    })
    this.translate.get('Quantity').subscribe((text: string) => {
      this.TQuantity = text;
    })
    this.getAllStockDetails();

    this.settings = {
      hideSubHeader: true,
      actions: {
        custom: [

          {
            name: 'editAction',
            title: '<i class="fa fa-edit text-warning"></i>'
          },
          {
            name: 'deleteAction',
            title: '<i class="fa fa-trash text-danger"></i>'
          }
        ],
        add: false,
        edit: false,
        delete: false
      },

      columns: {
        drugName: {
          title: 'Drug Name',
          type: 'string',
        },

        quantity: {
          title: 'Quantity',
          type: 'string',
        },

      }
    };
  }

  ngOnInit(): void {
    this.getAllDrugs();
  }
  ClearData() {
    this.AddForm.reset();
    this.EditForm.reset();
  }
  getAllDrugs() {
    this._PublicService.get("Drugs/ViewGetAll").subscribe(res => {
      this.Drugs = res;
    });
  }
  getAllStockDetails() {
    this._PublicService.get("StockDetails/ViewGetAll").subscribe(res => {
      this.StockDetails = res;
      this.source.load(this.StockDetails);


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

      this._ToasterService.success("Drug added to stock successfully", "Success");
    }, (error) => {
      this._ToasterService.danger(" Failed To Add ", "failed");
    });
    this.AddForm.reset();
  }

  openAddModal(dialog: TemplateRef<any>,) {
    this.dialogService.open(dialog, { backdropClass: "defaultdialogue" });

  }


  ///////////Edit Modal
  openEditModal(dialog: any, row: IStockDetails) {
    this.EditForm.controls['DrugId'].setValue(row.drugId);
    this.EditForm.controls['Quantity'].setValue(row.quantity);
    this.EditForm.controls['id'].setValue(row.id);
    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    });

  }
  updateStockDetails() {


    this._PublicService.put('StockDetails/UpdateData', this.EditForm.value).subscribe((Response) => {
      this.StockDetails = Response;

      this._ToasterService.success("Drug  In Stock successfully", "Success");
      this.getAllStockDetails();
    }, (error) => {
      this._ToasterService.danger(" Failed To  Update ", "failed");
    });
    this.EditForm.reset();

  }


  //Delete Modal
  DeleteStockDetails(id: number) {
    debugger;
    this._PublicService.delete("StockDetails/DeleteData", id).subscribe((Response) => {

      this._ToasterService.success("Drug DeletedFrom Stock successfully", "Success");
      this.getAllStockDetails();
    }, (error) => {
      this._ToasterService.danger(" Failed To  Delete ", "failed");
    });

  }


  openDeleteModal(dialog: any, id: number) {
    debugger;

    this.dialogService.open(dialog, {
      dialogClass: "defaultdialogue"

    }).onClose.subscribe(res => {
      debugger;
      if (res) {

        this.DeleteStockDetails(id);
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
