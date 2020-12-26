import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toastr: ToastrService) { }

  FireMessagePopUp(Type: number) {
    switch (Type) {
      case 1:
        this.toastr.success("Success To Update", "Successful Message")

        break;

      case 2:
        this.toastr.error("Error To Update", "Error Message")
        break;

      default:

    }
  }

}
