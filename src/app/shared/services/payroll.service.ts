import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private path = '';

  constructor(private baseService: BaseService) { }

  getAllPayrollDetailsApi(empId): Observable<any> {
      this.path = `payrollCalc/getAllPayroll/${empId}`;
      return this.baseService.get(this.path);
    }
}
