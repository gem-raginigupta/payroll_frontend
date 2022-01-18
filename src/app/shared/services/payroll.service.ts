import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private path = '';

  constructor(private baseService: BaseService) { }

  getPayrollDetailsApi(empId: number, month: number, year: number): Observable<any> {
      this.path = `payslip/getPayslip?employeeId=${empId}&payslipYear=${year}&payslipMonth=${month}`
      return this.baseService.get(this.path);
    }

    calculateMonthlyPayrollApi(year: number, month: number): Observable<any> {
      this.path = `payslip/batchInsertPayslip?payslipYear=${year}&payslipMonth=${month}`;
      return this.baseService.post(this.path);
    }
}
