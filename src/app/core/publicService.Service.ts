import { Observable } from "rxjs";
import { CookieService } from 'ngx-cookie-service';

import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";


import { environment } from "src/environments/environment";
import { AuthService } from "../auth/services/auth.service";

@Injectable()
export class PublicService {
  token: string;
  constructor(private http: HttpClient, private _authService: AuthService) {
    this.getToken();
  }


  getToken() {
    this.token = this._authService.getToken();
    return this._authService.getToken();

  }

  getOne(url: string): Observable<any> {
    return this.http.get<any[]>(environment.baseUrl + url,
      { headers: new HttpHeaders({ Authorization: "Bearer " + this.getToken() }) });

  }
  get(url: string): Observable<any[]> {
    const bearer = 'Bearer ' + this.getToken(); // this.anyService.getToken();
    return this.http.get<any[]>(environment.baseUrl + url,
      {
        headers: new HttpHeaders
          ({
            Authorization: bearer
          })
      });

  }




  getByID(url: string, id: any): Observable<any> {

    return this.http.get<any>(
      environment.baseUrl + url + "/?id="+id,
      { headers: new HttpHeaders({ Authorization: "Bearer " + this.getToken() }) });

  }
  // add
  post(url: string, data: any): Observable<any> {


    return this.http.post<any>(environment.baseUrl + url, data,
      { headers: new HttpHeaders({ Authorization: "Bearer " + this.getToken() }) });

  }
  // add
  put(url: string, data: any): Observable<any> {


    return this.http.put<any>(environment.baseUrl + url, data,
      { headers: new HttpHeaders({ Authorization: "Bearer " + this.getToken() }) });

  }

  delete(url: string, id: any): Observable<any> {
    return this.http.delete<any>(environment.baseUrl+url+"/"+ id,
      { headers: new HttpHeaders({ Authorization: "Bearer " + this.getToken() }) });
  }


  // add
  uploadFile(url: string, data: any): Observable<any> {


    return this.http.post(environment.baseUrl + url, data,
      {
        headers: new HttpHeaders({ Authorization: "Bearer " + this.getToken() })
        , reportProgress: true, observe: 'events'

      });

  }

  downloadFile(Url: string, fileName: string): Observable<any> {
    return this.http.get<any>(environment.baseUrl + Url + "/?filename=" + fileName,

      {
        responseType: "blob" as "json",
        headers: { Authorization: "Bearer " + localStorage.getItem("Token") },

      });
  }

}


