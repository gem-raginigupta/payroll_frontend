import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BaseService } from '../shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private path = '';
  constructor(private baseService: BaseService) { }

  loginApi(token: any): Observable<any>  {
    let headers = new HttpHeaders({'token': token});
    // headers.append('token', token)
    console.log('headers', headers)
    this.path = 'employee/login';
    return this.baseService.get(this.path, null, headers);
  }
}
