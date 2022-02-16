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
  @ViewChild('payslipPDF', { static: true }) payslipPDF: ElementRef;
  url: any = '';
  employeeId: number;
  employeeDetails: any;
  selectedPayslipMonth: string = 'select';
  selectedPayslipYear: any = 'select';
  years: number[] = [];
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
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar,
    private payrollService: PayrollService,
    private sanitizer: DomSanitizer) {
      for (let i = 2012; i <= new Date().getFullYear(); i++) {
        this.years.push(i);
      }
    }

  ngOnInit() {
    this.employeeDetails = this.employeeService.userDetails;
  }

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
        this.employeePayrollDetails = res.data;
        this.parsedEmployeePayrollDetails = this.parseEmployeePayrollDetails(
          this.employeePayrollDetails
        );
        // console.log('parsedEmployeePayrollDetails', this.parsedEmployeePayrollDetails);
        // console.log("employeePayrollDetails res", this.employeePayrollDetails);
        // console.log('payslipComponent', this.employeePayrollDetails[0]["payslipComponent"]);
        // console.log('parsedEmployeePayrollDetails["BASIC_PAY"]', this.parsedEmployeePayrollDetails["BASIC_PAY"]);
        setTimeout(() => {
          this.save_pdf();
        }, 1000);
      },
      (error) => {
        console.log("employeePayrollDetails failed", error);
      }
    );
  }

  public save_pdf() {
    let data = document.getElementById('payslipPDF');
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


}
