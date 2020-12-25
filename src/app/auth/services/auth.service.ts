import { Injectable, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { NetworkService } from "../../core/network.service";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { LoginModel } from "../login/models/login.model";
import { CookieService } from "ngx-cookie-service";
import { UserLoginModel } from "../login/models/userlogin.model";
import jwtDecode from "jwt-decode";
import { PublicService } from "src/app/Service/Public.Service/public-service.service";



@Injectable()
export class AuthService implements CanActivate {
  private loggedIn = new BehaviorSubject<boolean>(this.tokenAvailable());
  constructor(
    private _router: Router,
    private http: HttpClient,
    private network: NetworkService,
    private _coockieService: CookieService,
    private _publicService: PublicService,


  ) { }

  login(user: LoginModel) {
    this._publicService.Add(
      "Account", "Login",
      user
    ).subscribe(
      {
        next: (response: UserLoginModel) => {

          let result = jwtDecode<any>(response.token);
          this._coockieService.set('token', response.token);
          this._coockieService.set('userName', result.unique_name);
          this._coockieService.set('userId', result.UserId);
          this._coockieService.set('Password', result.Password);
          this._router.navigate(['/Home']);
          debugger;

        }, error: (error) => {
          console.log(error);
          debugger;

        }
      }
    );
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  private tokenAvailable(): boolean {
    console.log(localStorage.getItem('token'));
    return !!localStorage.getItem('token');
  }


  changePassword(data: any) {
    return this.http.put<any>(
      environment.serverUrl + "Account/ChangePassword/",
      data
    );
  }

  logout() {
    this._coockieService.deleteAll();
    window.location.replace("login");
  }


  logoutOnClose() {
    let LoginUser = JSON.parse(localStorage.getItem("LoginUser"));
    if (LoginUser !== null) {
      this.http
        .post<LoginModel>(environment.serverUrl + "account/logout", LoginUser)
        .subscribe(
          (success) => {
            localStorage.clear();
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.network.online) {
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
    } else {
      console.log("Network Disconnt");

      // momken hena na5leeha yroute 3ala page feeha no connection
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



}

