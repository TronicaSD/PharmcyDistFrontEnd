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
export class FileService {
  constructor(private http: HttpClient) {}


  downloadFile(fileName: string,Url: string): Observable<any> {
    return this.http.get<any>(environment.serverUrl + Url+ "/" + fileName,
        {
          responseType: "blob" as "json",
          headers: { Authorization: "Bearer " + localStorage.getItem("Token") }
        });
      }

    }
 