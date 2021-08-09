import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private path = '';
  private param: HttpParams;

  constructor(private baseService: BaseService, private http: HttpClient) { }

  // getEmployeeDetailsApi(empCode: string): Observable<any> {
  //   this.path = '';
  //   this.param = new HttpParams().set('q', empCode);
  //   return this.baseService.get(this.path, this.param);
  // }

  getAllEmployeesDetailsApi(): Observable<any> {
      this.path = 'employee/getAllEmployees';
      return this.baseService.get(this.path);
    }

  postEmployeeDetailsApi(data: any): Observable<any>  {
    this.path = 'employee/addNewEmployee';
    return this.baseService.post(this.path, data);
  }

  postEmployeeCTCDetailsApi(data: any): Observable<any>  {
    this.path = 'employee-ctc/addEmployeeCtc';
    return this.baseService.post(this.path, data);
  }
}
