import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalServiceErrorHandler } from 'src/app/core/gobalerrorservicehandler';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showPassword:boolean=false;
  loginForm:FormGroup;
  
  constructor(private _formbuilder:FormBuilder ,private _loginService :AuthService) { 
   this.loginForm= this._formbuilder.group({
userName:['',Validators.required],
password:['',[Validators.required,Validators.minLength(8)]],

    });


  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  };

login(){

  this._loginService.login(this.loginForm.value);
  
}
  ngOnInit(): void {

  }
   getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }
  toggleShowPassword (){
    this.showPassword=!this.showPassword;
  }

}
