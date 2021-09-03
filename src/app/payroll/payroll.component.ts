import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatTableModule } from '@angular/material';
import { EmployeeService} from '../shared/services/employee.service';

@Component({
    selector: 'payroll',
    templateUrl: './payroll.component.html',
    styleUrls: ['./payroll.component.css']
  })


  export class PayrollComponent{
      empListSourceRaw: any;
      public empListSource: MatTableDataSource<any>;
      displayedColumns: string[] = ['gem_id', 'name', 'dept', 'role', 'total_salary', 'payment_status'];
      @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
      @ViewChild(MatSort, {static: true}) sort: MatSort;
      ngOnInit() {
        this.get_empDetails();
      }
      get_empDetails() {
        this.empListSourceRaw = [
          {'GEM_ID': 'GSI G 001','Name': 'Den Cooper', 'Department': 'Android Dev', 'Role': 'Executive Manger', 'Total_Salary': 'Rs. 655,733.00', 'Payment_status': 'Paid'},
          {'GEM_ID': 'GSI G 002','Name': 'Eric Cooper', 'Department': 'Android Dev', 'Role': 'Executive Manger', 'Total_Salary': 'Rs. 655,733.00', 'Payment_status': 'Paid'},
          {'GEM_ID': 'GSI G 003','Name': 'Paul Cooper', 'Department': 'Android Dev', 'Role': 'Executive Manger', 'Total_Salary': 'Rs. 655,733.00', 'Payment_status': 'Paid'},
          {'GEM_ID': 'GSI G 004','Name': 'Kevin Malone', 'Department': 'Android Dev', 'Role': 'Executive Manger', 'Total_Salary': 'Rs. 655,733.00', 'Payment_status': 'Paid'},
          {'GEM_ID': 'GSI G 005','Name': 'Michael Scott', 'Department': 'Android Dev', 'Role': 'Executive Manger', 'Total_Salary': 'Rs. 655,733.00', 'Payment_status': 'Paid'}
        ]
        this.empListSource = new MatTableDataSource<any>(this.empListSourceRaw)
        console.log(this.empListSource)
      }
  }
