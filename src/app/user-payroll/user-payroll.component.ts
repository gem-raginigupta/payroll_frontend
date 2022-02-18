import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { EmployeeService } from '../shared/services/employee.service';
import { PayrollService } from '../shared/services/payroll.service';

@Component({
  selector: 'app-user-payroll',
  templateUrl: './user-payroll.component.html',
  styleUrls: ['./user-payroll.component.css']
})
export class UserPayrollComponent implements OnInit {
  @ViewChild('userPayslipPDF', { static: true }) userPayslipPDF: ElementRef;
  url: any = '';
  employeeId: number;
  selectedPayslipMonth: string = 'select';
  selectedPayslipYear: any = 'select';
  years: number[] = [];
  durationInSeconds = 5;
  months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];
  employeePayrollDetails: any;
  parsedEmployeePayrollDetails: any;
  constructor(
    public employeeService: EmployeeService,
    private _snackBar: MatSnackBar,
    private payrollService: PayrollService,
    private sanitizer: DomSanitizer) {
      for (let i = 2012; i <= new Date().getFullYear(); i++) {
        this.years.push(i);
      }
    }

  ngOnInit() {}

  resetPayslipDialog() {
    this.url = '';
    this.selectedPayslipMonth = 'select';
    this.selectedPayslipYear = 'select';
  }

  parseEmployeePayrollDetails(employeePayrollDetails) {
    let parsedData = {};
    for (let i = 0; i < employeePayrollDetails.length; i++) {
      parsedData[employeePayrollDetails[i]["payslipComponent"]] =
        employeePayrollDetails[i]["componentAmount"];
    }
    return parsedData;
  }

  getPayrollDetails() {
    let month = 0;
    this.months.forEach((mon) => {
      if (mon.name === this.selectedPayslipMonth) {
        month = mon.value;
      }
    });
    this.payrollService.getPayrollDetailsApi(this.employeeService.userDetails.employeeId, month, this.selectedPayslipYear).subscribe(
      (res) => {
        if (res.data === null || !this.employeeService.userDetails) {
          this.url = '';
          this.openSnackbar('Failed to display payslip.', 'Close');
        }
        this.employeePayrollDetails = res.data;
        this.parsedEmployeePayrollDetails = this.parseEmployeePayrollDetails(
          this.employeePayrollDetails
        );
        setTimeout(() => {
          this.save_pdf();
        }, 1000);
      },
      (error) => {
        this.openSnackbar('Failed to display payslip.', 'Close');
        console.log("employeePayrollDetails failed", error);
      }
    );
  }

  public save_pdf() {
    let data = document.getElementById('userPayslipPDF');
    data.style.display = 'inline';
    let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 180;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');

      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      let blob = pdf.output('blob');
      // console.log('blob', blob);
      data.style.display = 'none';
      let fileURL = URL.createObjectURL(blob);
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
      // pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

  openSnackbar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }
}
