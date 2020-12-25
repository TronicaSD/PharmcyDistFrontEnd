import { Observable } from "rxjs";
import { OnInit } from "@angular/core";

import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { environment } from "../../environments/environment";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class publicService {
  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Server  Error");
  }
  getAll(apiController: string, action?: string): Observable<any[]> {
    if(action){
      return this.http.get<any[]>(environment.serverUrl + apiController+ "/" + action ,{headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })});
    }
    else{
      return this.http.get<any[]>(environment.serverUrl + apiController,{headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })});
    }
  }

  

  getByAction(apiController: string, action: string): Observable<any[]> {
    return this.http.get<any[]>(
      environment.serverUrl + apiController + "/" + action, {headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })}
    );
  }

  getAllbyDates(
    apiController: string,
    newFromDate,
    newToDate
  ): Observable<any[]> {
    return this.http.get<any[]>( environment.serverUrl +apiController +"?" +"from= " +newFromDate +"&to= " +newToDate,
     {headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })}
    );
  }

  getByID(id: any, apiController: string, action?: string): Observable<any> {
    if (action) {
      return this.http.get<any>(
        environment.serverUrl + apiController + "/" + action + "/" + id,{headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })});
    } else {
      return this.http.get<any>(
        environment.serverUrl + apiController + "/" + id,{headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })});
    }
  }
  // add
  post(data: any, apiController: string, action?: string): Observable<any> {
    if (action) {
      return this.http.post<any>(environment.serverUrl + apiController + "/" + action,data
      ,{headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })});
    } else {
      return this.http.post<any>(environment.serverUrl + apiController, data, 
        {headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })});
    }
  }
  //edit
  put(data: any, apiController: string, action?: string): Observable<any> {
    if (action) {
      return this.http.put<any>(
        environment.serverUrl + apiController + "/" + action,data,{headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })});
    } else {
      return this.http.put<any>(environment.serverUrl + apiController, data,{headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })});
    }
  }
  delete(id: any, apiController: string): Observable<any> {
    return this.http.delete<any>(environment.serverUrl + apiController + "/" + id,{headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })});
  }

  deleteTwoParams(fileId: any, channelId:any ,apiController: string): Observable<any> {

    return this.http.delete<any>(environment.serverUrl + apiController  +"?" +"fileId= " +fileId +"&channelId= " +channelId,{headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })});
  }

  uploadFile(data: any, apiController: string,action: string): Observable<any> {
    return this.http.post<any>(
      environment.serverUrl + apiController + "/" + action,
      data,{headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("Token") })});
  }

  downloadFile(fileName: string,apiController: string,action: string,fileType: string): Observable<any> {
    return this.http.get<any>(environment.serverUrl + apiController + "/" + action + "/" + fileName,
        {
          responseType: "blob" as "json",
          headers: { Authorization: "Bearer " + localStorage.getItem("Token") }
        })
      .map(res => {
        var blob = new Blob([res], { type: fileType });
        return blob;
      });
  }
}
