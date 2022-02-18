import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  MatDialog,
  MatPaginator,
  MatSnackBar,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { EmployeeService } from "../shared/services/employee.service";
import { PayrollService } from "../shared/services/payroll.service";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { DomSanitizer } from "@angular/platform-browser";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "payroll",
  templateUrl: "./payroll.component.html",
  styleUrls: ["./payroll.component.css"],
})
export class PayrollComponent implements OnInit {
  empListSourceRaw: any;
  today: Date;
  sixMonthsAgo: Date;
  public empListSource: MatTableDataSource<any>;
  allEmpDetails: any;
  empListDataSource: any;
  allPayrollDetails: any;
  payrollDataParsed: any = [];
  employeeId: number;
  employeePayrollDetails: any;
  parsedEmployeePayrollDetails: any;
  durationInSeconds = 5;
  employeeDetails: any;
  selectedPayrollMonth: string = 'select';
  selectedPayrollYear: any = 'select';
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
  displayedColumns: string[] = [
    "gem_id",
    "name",
    "dept",
    "role",
    "total_salary",
    "payment_status",
    "options",
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('payslipPDF', { static: true }) payslipPDF: ElementRef;
  url: any = '';

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar,
    private payrollService: PayrollService,
    private sanitizer: DomSanitizer
  ) {
    this.today = new Date();
    this.sixMonthsAgo = new Date();
    this.sixMonthsAgo.setMonth(this.today.getMonth() - 6);

    for (let i = 2012; i <= new Date().getFullYear(); i++) {
      this.years.push(i);
    }
    // console.log('years', this.years);
  }
  ngOnInit() {
    this.getAllEmployeesDetails();
    this.getAllPayrollDetails();
  }
  getAllPayrollDetails() {
    this.employeeService.getAllPayrollDetailsApi().subscribe(
      (res) => {
        this.allPayrollDetails = res.data;
        this.payrollDataParsed = this.parsePayrollData(res.data);
        // console.log('allPayrollDetails', this.allPayrollDetails);
        // console.log("Parsed", this.payrollDataParsed);
      },
      (error) => {
        console.log("get all payroll details failed", error);
      }
    );
  }

  getAllEmployeesDetails() {
    this.employeeService.getAllEmployeesDetailsApi().subscribe(
      (res) => {
        this.allEmpDetails = res.data;
        this.empListDataSource = new MatTableDataSource<any>(
          this.allEmpDetails
        );
        this.empListDataSource.sort = this.sort;
        this.empListDataSource.paginator = this.paginator;
        // console.log('get all emp details res', this.allEmpDetails);
      },
      (error) => {
        console.log("get all emp details failed", error);
      }
    );
  }
  parsePayrollData(payrollData) {
    this.payrollDataParsed = {};
    for (let i = 0; i < payrollData.length; i++) {
      if (payrollData[i].component == "BASIC_PAY") {
        this.payrollDataParsed[payrollData[i].employeeId] =
          payrollData[i].value;
      }
    }
    return this.payrollDataParsed;
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
    this.payrollService.getPayrollDetailsApi(this.employeeId, month, this.selectedPayslipYear).subscribe(
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

  getEmployeesDetails(element) {
    this.employeeService
      .getEmployeDetailsApi(element.employeeId)
      .subscribe((res) => {
        this.employeeDetails = res.data;
        console.log('employeeDetails', this.employeeDetails);
      });
  }

  openPayslipDialog(templateRef: TemplateRef<any>, element) {
    console.log('payslipPDF', this.payslipPDF);
    let dialogRef = this.dialog.open(templateRef, {
      width: "800px",
      height: "600px",
    });
    this.employeeId = element.employeeId;
    this.getEmployeesDetails(element);
    console.log('empId', element.employeeId);
    // console.log(this.employeePayrollDetails);
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  onClose() {
    this.dialog.closeAll();
    this.resetPayslipDialog();
  }

  resetPayslipDialog() {
    this.url = '';
    this.selectedPayslipMonth = 'select';
    this.selectedPayslipYear = 'select';
  }

  openDatePicker(dp) {
    dp.open();
  }

  closeDatePicker(eventData: any, dp?: any) {
    // get month and year from eventData and close datepicker, thus not allowing user to select date
    dp.close();
  }

  // save_pdf() {
  //   this.getPayrollDetails();
  //   console.log("Fetching PDF");
  //   let doc = new jsPDF("p", "pt", "a4");
  //   // pdf.setFont("helvetica");
  //   // pdf.setFontType("bold");
  //   let width = doc.internal.pageSize.getWidth();
  //   let height = doc.internal.pageSize.getHeight();
  //   let position = 0;
  //   const pdf_temp = document.getElementById("payslipPDF");
  //   console.log(pdf_temp);
  //   doc.html(pdf_temp, {
  //     callback:(pdf) => {
  //       doc.setFontSize(1);
  //       doc.save("Payroll.pdf");
  //     },
  //   });
  // }

  // public save_pdf() {
  //   let data = document.getElementById('uniquePdf');
  //   data.style.display = 'inline';
  //   data.innerHTML = `<html>
  //   <head>
  //   <style>
  //   .pdfhead {
  //     font-size: 36px;
  //     text-align: center;
  //     font-weight: bold;
  //   }
  //   .pdfsubhead {
  //     font-size: 24px;
  //     text-align: center;
  //     font-weight: bold;
  //   }
  //   .table_pdf {
  //     width: 98%;
  //     border: 1px solid;
  //     border-color: black;
  //     margin-left: 14px;
  //   }
  //   .table_pdf_row {
  //     height: 15px;
  //     border: 1px solid;
  //     border-color: black;
  //   }
  //   .pdfcell {
  //     font-size: 20px;
  //     padding: 0.6px;
  //     width: 140px;
  //     border: 1px solid;
  //     border-color: black;
  //   }
  //   </style>
  //   </head>
  //   <body>
  //   <div class="pdfhead">
  //     GEMINI SOLUTIONS PRIVATE LIMITED
  //   </div>
  //   <div class="pdfsubhead">
  //     Plot No. 119, Udyog Vihar, Phase-1, Sector-20, Gurgaon, Haryana-122016
  //   </div>
  //   <br />
  //   <table class="table_pdf">
  //     <tr class="table_pdf_row">
  //       <td class="pdfcell">Name</td>
  //       <td class="pdfcell">
  //         ${this.employeeDetails["firstName"]}
  //         ${this.employeeDetails["lastName"] }
  //       </td>
  //       <td class="pdfcell">Employee No.</td>
  //       <td class="pdfcell">${this.employeeDetails["employeeId"] }</td>
  //     </tr>
  //     <tr class="table_pdf_row">
  //       <td class="pdfcell">Joining Date</td>
  //       <td class="pdfcell">${this.employeeDetails["dateOfJoining"] }</td>
  //       <td class="pdfcell">Bank Name</td>
  //       <td class="pdfcell">Yes Bank Ltd</td>
  //     </tr>
  //     <tr class="table_pdf_row">
  //       <td class="pdfcell">Aadhar</td>
  //       <td class="pdfcell">${this.employeeDetails["aadhaar"] }</td>
  //       <td class="pdfcell">PAN Number</td>
  //       <td class="pdfcell">${this.employeeDetails["pan"] }</td>
  //     </tr>
  //     <tr class="table_pdf_row">
  //       <td class="pdfcell">Bank Account No</td>
  //       <td class="pdfcell">${this.employeeDetails["bankAcctNo"] }</td>
  //       <td class="pdfcell">PF No</td>
  //       <td class="pdfcell">${this.employeeDetails["pfNo"] }</td>
  //     </tr>
  //     <tr class="table_pdf_row">
  //       <td class="pdfcell">UAN No</td>
  //       <td class="pdfcell">${this.employeeDetails["uanNo"] }</td>
  //       <td class="pdfcell"></td>
  //       <td class="pdfcell"></td>
  //     </tr>
  //     </table>
  //     <br />
  //     <table class="table_pdf">
  //       <tr class="table_pdf_row">
  //         <td class="pdfcell"><b>Earnings</b></td>
  //         <td class="pdfcell"><b>Amount</b></td>
  //         <td class="pdfcell"><b>Deductions</b></td>
  //         <td class="pdfcell"><b>Amount</b></td>
  //       </tr>
  //       <tr class="table_pdf_row">
  //         <td class="pdfcell">BASIC</td>
  //         <td class="pdfcell">
  //         ${this.parsedEmployeePayrollDetails["BASIC_PAY"] }.00
  //         </td>
  //         <td class="pdfcell">PF</td>
  //         <td class="pdfcell">${this.parsedEmployeePayrollDetails["PF"] }.00</td>
  //       </tr>
  //       <tr class="table_pdf_row">
  //         <td class="pdfcell">HRA</td>
  //         <td class="pdfcell">${this.parsedEmployeePayrollDetails["HRA"] }.00</td>
  //         <td class="pdfcell"></td>
  //         <td class="pdfcell"></td>
  //       </tr>
  //       <tr class="table_pdf_row">
  //         <td class="pdfcell">STD ALLOWANCE</td>
  //         <td class="pdfcell">
  //         ${this.parsedEmployeePayrollDetails["STANDARD_ALLOWANCE"] }.00
  //         </td>
  //         <td class="pdfcell"></td>
  //         <td class="pdfcell"></td>
  //       </tr>
  //       <tr class="table_pdf_row">
  //         <td class="pdfcell">SPECIAL ALLOWANCE</td>
  //         <td class="pdfcell">
  //         ${this.parsedEmployeePayrollDetails["SPECIAL_ALLOWANCE"] }.00
  //         </td>
  //         <td class="pdfcell"></td>
  //         <td class="pdfcell"></td>
  //       </tr>
  //       <tr class="table_pdf_row">
  //         <td class="pdfcell"><b>Total Earnings</b></td>
  //         <td class="pdfcell">
  //           <b>${this.parsedEmployeePayrollDetails["TOTAL_EARNINGS"] }.00 </b>
  //         </td>
  //         <td class="pdfcell"><b> Total Deduction</b></td>
  //         <td class="pdfcell">
  //           <b>${this.parsedEmployeePayrollDetails["TOTAL_DEDUCTIONS"] }.00</b>
  //         </td>
  //       </tr>
  //     </table>
  //     </body>
  // </html>`;
  //   let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  //   // pdf.html(data).then((can) => {
  //   html2canvas(data).then((canvas) => {
  //     // Few necessary setting options
  //     var imgWidth = 180;
  //     var imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     const contentDataURL = canvas.toDataURL('image/png');

  //     var position = 0;
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //     let blob = pdf.output('blob');
  //     // console.log('blob', blob);
  //     let fileURL = URL.createObjectURL(blob);
  //     data.style.display = 'none';
  //     this.url = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
  //   });
  //   // this.url = this.sanitizer.bypassSecurityTrustResourceUrl(pdf.output('datauristring'));
  // //  });
  //   // html2canvas(data).then((canvas) => {
  //   //   // Few necessary setting options
  //   //   var imgWidth = 180;
  //   //   var imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   //   const contentDataURL = canvas.toDataURL('image/png');

  //   //   var position = 0;
  //   //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //   //   let blob = pdf.output('blob');
  //   //   // console.log('blob', blob);
  //   //   let fileURL = URL.createObjectURL(blob);
  //   //   this.url = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
  //   //   // pdf.save('MYPdf.pdf'); // Generated PDF
  //   // });

  //   //
  // }

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

  calculateMonthlyPayroll() {
    let month = 0;
    this.months.forEach((mon) => {
      if (mon.name === this.selectedPayrollMonth) {
        month = mon.value;
      }
    });
    this.payrollService
      .calculateMonthlyPayrollApi(this.selectedPayrollYear, month)
      .subscribe(
        (res) => {
          console.log("calculate monthly payroll res", res);
          this.openSnackbar(res.data, 'Close');
        },
        (error) => {
          this.openSnackbar('Monthly payroll calculation failed', 'Close');
          console.log("calculate monthly payroll failed", error);
        }
      );
  }

  openSnackbar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }
}
