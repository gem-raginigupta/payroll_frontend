import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AddEmployeeDetailsComponent } from '../add-employee-details/add-employee-details.component';
import { EmployeeService } from '../shared/services/employee.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EmployeeDetailsComponent implements OnInit {

  isClearEnable: boolean = false;
  showSearchParams: boolean = true;
  expandedElement: any;
  allEmpDetails: any;
  employeeCTCDetails: any[] = [];
  empDetails: any = [{
    header: 'Permanent Address', field: 'permenantAddress'
  },
  {
    header: 'Correspondence Address', field: 'correspondenceAddress'
  },
  {
    header: 'Permenant Account Number', field: 'pan'
  },
    {header: 'UAN Number', field: 'uanNo'},
    {header: 'PF Number', field: 'pfNo'},
    {header: 'Bank Account Number', field: 'bankAcctNo'},
    {header: 'Bank Account Name', field: 'bankAcctName'},
    {header: 'Bank Account Address', field: 'bankAcctAddress'},
    {
    header: 'Bank IFSC', field: 'bankIFSC',
  }]

  public empListDataSource: MatTableDataSource<any>;
  constructor(public dialog: MatDialog, private employeeService: EmployeeService) { }
  displayedColumns: string[] = ['id', 'name', 'doj', 'dob', 'doe', 'cityType', 'aadhaar', 'status'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() {
    this.getAllEmployeesDetails();
  }

  openAddEmpDialog(): void {
      const dialogRef = this.dialog.open(AddEmployeeDetailsComponent, {
        width: '1000px',
        height: '640px',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
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

    getEmployeeCTCDetails(element) {
      this.employeeService.getEmployeeCTCDetailsApi(element.employeeId).subscribe(
        res => {
          console.log('getEmployeeCTCDetailsApi res', res);
          this.employeeCTCDetails = res.data;
        },
        error => {
          console.log('getEmployeeCTCDetailsApi failed', error);
        }
      );
      }
}
