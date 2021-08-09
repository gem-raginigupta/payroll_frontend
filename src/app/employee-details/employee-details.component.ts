import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AddEmployeeDetailsComponent } from '../add-employee-details/add-employee-details.component';
import { EmployeeService } from '../shared/services/employee.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  isClearEnable: boolean = false;
  showSearchParams: boolean = true;
  expandedElement: any;
  allEmpDetails: any;
  public empListDataSource: MatTableDataSource<any>;
  constructor(public dialog: MatDialog, private employeeService: EmployeeService) { }
  displayedColumns: string[] = ['id', 'name', 'doj', 'dob', 'doe'];
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

}
