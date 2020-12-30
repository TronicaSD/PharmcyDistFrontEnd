import { HostBinding, Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  @HostBinding('class')
  classes = 'example-items-rows';

  constructor(private toastrService: NbToastrService) {
    debugger;
  }

  FireMessagePopUp(Type: number) {
    switch (Type) {
      case 1:
        this.SuccessToaster();

        break;

      case 2:
        // this.toastr.error("Error To Update", "Error Message")
        break;

      default:

    }
  }

  SuccessToaster() {
    this.toastrService.show(
      'Success To Update',
      'Successful Message',
    );
  }

}
