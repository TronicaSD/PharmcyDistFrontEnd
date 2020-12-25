import { FormGroup } from "@angular/forms";

export class GlobalServiceErrorHandler {

    public hasError = ( form :FormGroup,controlName: string, errorName: string) => {
        return form.controls[controlName].hasError(errorName);
      };
}