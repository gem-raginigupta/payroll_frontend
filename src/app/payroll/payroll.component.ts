import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatTableModule } from '@angular/material';
import { EmployeeService } from '../shared/services/employee.service';

@Component({
  selector: 'payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css']
})


export class PayrollComponent {
  empListSourceRaw: any;
  constructor(public dialog: MatDialog, private employeeService: EmployeeService) { }
  public empListSource: MatTableDataSource<any>;
  allEmpDetails: any;
  empListDataSource: any;
  allPayrollDetails: any;
  payrollDataParsed: any;
  displayedColumns: string[] = ['gem_id', 'name', 'dept', 'role', 'total_salary', 'payment_status'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.getAllEmployeesDetails();
    this.getAllPayrollDetails();
  }
  getAllPayrollDetails() {
    this.employeeService.getAllPayrollDetailsApi().subscribe(
      res => {
        this.allPayrollDetails = res.data;
        this.payrollDataParsed = this.parsePayrollData(res.data);
        console.log(this.allPayrollDetails);
        console.log('Parsed', this.payrollDataParsed);
      },
      error => {
        console.log('get all payroll details failed', error);
      }
    );
  }
  getAllEmployeesDetails() {
    this.employeeService.getAllEmployeesDetailsApi().subscribe(
      res => {
        this.allEmpDetails = res.data;
        this.empListDataSource = new MatTableDataSource<any>(this.allEmpDetails);
        this.empListDataSource.sort = this.sort;
        this.empListDataSource.paginator = this.paginator;
        console.log('get all emp details res', this.allEmpDetails);
      },
      error => {
        console.log('get all emp details failed', error);
      }
    );
  }
  parsePayrollData(payrollData) {
    this.payrollDataParsed = {}
    for (let i = 0; i < payrollData.length; i++){
      if(payrollData[i].component == 'BASIC_PAY'){
        this.payrollDataParsed[payrollData[i].employeeId] = payrollData[i].value
      }
    }
    return this.payrollDataParsed;
  }
}
