import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private path;
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

  postInvestmentDeclarationAPI(data: any){
    this.path = 'employee-Invest-Declare/addInvestmentDeclaration';
    return this.baseService.post(this.path, data);
  }

  getCTCComponentsApi(): Observable<any> {
    this.path = 'options/CTC_COMPONENT';
    return this.baseService.get(this.path);
  }

  getAllCTCComponentsApi(): Observable<any> {
    this.path = 'ctc/allCtcComponent';
    return this.baseService.get(this.path);
  }

  calculateCTCApi(data: any): Observable<any>  {
    this.path = 'payrollCalc/getGrossAndCTCbeforeTax';
    return this.baseService.post(this.path, data);
  }

  getEmployeeCTCDetailsApi(empId: any): Observable<any> {
    this.param = new HttpParams().set('employeeId', empId);
    this.path = `employee-ctc/getEmployeeCtcDetail`;
    return this.baseService.get(this.path, this.param);
  }

  getEmployeDetailsApi(empId: any): Observable<any> {
    // this.param = new HttpParams().set('employeeId', empId);
    this.path = `employee/getEmployeeById/` + empId;
    return this.baseService.get(this.path);
  }

  getAllPayrollDetailsApi(): Observable<any> {
    this.path = 'payrollCalc/getAllPayroll';
    return this.baseService.get(this.path);
  }

  getInvestmentDelarationSectionApi(): Observable<any> {
    this.path = `options/INVESTMENT_DECLARATION_SECTION`;
    return this.baseService.get(this.path);
  }

  getInvestmentBySectionApi(section: any): Observable<any> {
    this.path = `options/investment/` + section;
    return this.baseService.get(this.path);
  }

  postBulkFileUploadApi(data: any): Observable<any>  {
    this.path = 'employee/bulkImportEmployee';
    return this.baseService.post(this.path, data);
  }

  getInvestmentLimitApi(): Observable<any> {
    this.path = `InvestLimitXref/allInvestLimitXref`;
    return this.baseService.get(this.path);
  }
}
