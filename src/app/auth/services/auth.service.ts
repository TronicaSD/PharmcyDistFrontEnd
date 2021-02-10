import { Injectable, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { LoginModel } from "../login/models/login.model";
import { CookieService } from "ngx-cookie-service";
import { UserLoginModel } from "../login/models/userlogin.model";
import jwtDecode from "jwt-decode";
import { PublicService } from "src/app/core/publicService.Service";



@Injectable()
export class AuthService implements CanActivate {
  private loggedIn = new BehaviorSubject<boolean>(this.tokenAvailable());
  constructor(
    private _router: Router,
    private http: HttpClient,
    private _coockieService: CookieService,


  ) { }

  login(user: LoginModel) {
    this.http.post(environment.baseUrl +
      "Account/Login",
      user
    ).subscribe(
      {
        next: (response: UserLoginModel) => {

          let result = jwtDecode<any>(response.token);
          this._coockieService.set('token', response.token);
          this._coockieService.set('userName', result.unique_name);
          this._coockieService.set('userId', result.UserId);
          this._coockieService.set('role', result.role);
          this._coockieService.set('language', "ar");

          this.navigateToModule(result.role);


        }, error: (error) => {
          console.log(error);

        }
      }
    );
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  private tokenAvailable(): boolean {
    return !!localStorage.getItem('token');
  }

navigateToModule(role:string){
  debugger;

  switch (role) {
    case 'admin':
  this._router.navigate(['/admin']);
      
      break;

      case 'agent':
  this._router.navigate(['/home']);
      
      break;

      case 'gm':
        this._router.navigate(['/reports']);
            
            break;
  
    default:
      break;
  }
}
  changePassword(data: any) {
    return this.http.put<any>(
      environment.baseUrl + "Account/ChangePassword/",
      data
    );
  }

  logout() {
    this._coockieService.deleteAll();
    window.location.replace("login");
  }



  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
 
      if (this.isAuthenticated()) {

        if (next.data.role && next.url[0].path != "change-password") {
          let userRole = localStorage.getItem("Role");
          if (userRole == next.data.role) return true;
        } else {
          this._router.navigate(["login"]);
        }
      } else {
        this.logout();
      }
  
  }
  /**
   * this is used to clear anything that needs to be removed
   */
  /**
   * check for expiration and if token is still existing or not
   * @return {boolean}
   */
  isAuthenticated(): boolean {
    let res = this._coockieService.get("token") !== null && !this.isTokenExpired();

    return res;
  }

  // simulate jwt token is valid
  // https://github.com/theo4u/angular4-auth/blob/master/src/app/helpers/jwt-helper.ts
  isTokenExpired(): boolean {
    let token = jwtDecode<any>(this._coockieService.get('token'));
    return token.exp ? false : true;

  }
  /**
   * this is used to clear local storage and also the route to login
   */


  getUserClaims() {

    if (this.isAuthenticated) {
      return jwtDecode<any>(this._coockieService.get('token'));
    }

    return undefined;
  }

  getUserRole() {
    if (this.isAuthenticated) {
      return this._coockieService.get('role');
    }

    return undefined;
  }





  getToken() {
    return this._coockieService.get('token');



  }


}

