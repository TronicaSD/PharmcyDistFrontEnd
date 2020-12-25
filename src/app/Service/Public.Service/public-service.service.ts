import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PublicService {
  BaseUrl: string = "https://localhost:44353/api/";

  constructor(
    private _Http: HttpClient
  ) { }

  getAll(ControllerName: any, MethodName: any) {
    return this._Http.get(this.BaseUrl + ControllerName + '/' + MethodName).pipe(x => x);
  }

  Add(ControllerName: any, MethodName: any, Object: any) {
    return this._Http.post(this.BaseUrl + ControllerName + '/' + MethodName, Object).pipe(x => x);
  }

  Delete(ControllerName: any, MethodName: any, Id: number) {
    return this._Http.delete(this.BaseUrl + ControllerName + '/' + MethodName + '?id=' + Id).pipe(x => x);
  }

  Update(ControllerName: any, MethodName: any, Object: any) {
    return this._Http.put(this.BaseUrl + ControllerName + '/' + MethodName, Object).pipe(x => x);
  }

  uploadFile(ControllerName: any, MethodName: any, file: Blob): Observable<HttpEvent<void>> {
    const formData = new FormData();
    formData.append('file', file);
    return this._Http.request
      (new HttpRequest(
        'POST',
        this.BaseUrl + ControllerName + '/' + MethodName,
        formData,
        {
          reportProgress: true
        }));
  }


}
