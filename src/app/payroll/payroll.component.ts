import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatTableModule,
} from "@angular/material";
import { EmployeeService } from "../shared/services/employee.service";
import { PayrollService } from "../shared/services/payroll.service";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "payroll",
  templateUrl: "./payroll.component.html",
  styleUrls: ["./payroll.component.css"],
})
export class PayrollComponent implements AfterViewInit {
  empListSourceRaw: any;
  today: Date;
  sixMonthsAgo: Date;
  public empListSource: MatTableDataSource<any>;
  allEmpDetails: any;
  empListDataSource: any;
  allPayrollDetails: any;
  payrollDataParsed: any = [];
  employeePayrollDetails: any;
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  displayedColumns: string[] = ['gem_id', 'name', 'dept', 'role', 'total_salary', 'payment_status', 'options'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("iframePay", { static: false }) iframePay: ElementRef;
  payUrl: string;

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private payrollService: PayrollService
  ) {
    this.today = new Date();
    this.sixMonthsAgo = new Date();
    this.sixMonthsAgo.setMonth(this.today.getMonth() - 6);
  }
  ngAfterViewInit(): void {
    // const iframDoc = this.iframePay.nativeElement.contentWindow.document;
    // iframDoc.head.appendChild('style.css');
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
        // console.log(this.allPayrollDetails);
        // console.log('Parsed', this.payrollDataParsed);
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

  getPayrollDetails(element) {
    this.payrollService.getAllPayrollDetailsApi(element.employeeId).subscribe(
      (res) => {
        this.employeePayrollDetails = res.data;
        // console.log("employeePayrollDetails res", this.employeePayrollDetails);
        this.generatePayrollPDF();
      },
      (error) => {
        console.log("employeePayrollDetails failed", error);
      }
    );
  }

  generatePayrollPDF() {
    let payrollArr = [];
    const header = [{text: 'Earnings', style: 'header'}, ''];
    const subHeader = [{text: '', fillColor: '#e9f6ff', height: '30px'}, {text: 'Amount in (Rs.)', style: 'subHeader'}];
    payrollArr.push(header);
    payrollArr.push(subHeader);
    this.employeePayrollDetails.forEach((detail) => {
      payrollArr.push([detail.component, detail.value]);
    });
    let docDefinition = {
      content: [
        {
          style: 'mainContent',
          layout: "headerLineOnly", // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            // widths: ["*", "auto", 100, "*"],

            body: payrollArr,
          },
        },
      ],

      styles: {
        header: {
          color: 'grey',
          fontSize: 12,
          bold: true,
          alignment: 'left',
          margin: [ 6, 6, 6, 6 ]
        },
        subHeader: {
          fillColor: '#e9f6ff',
          color: 'grey',
          fontSize: 12,
          bold: true,
          alignment: 'right',
          height: '30px',
          margin: [ 6, 6, 6, 6 ]
        },
        mainContent: {
          margin: [ 10, 20, 10, 20 ],
          fontSize: 12,
        },
        anotherStyle: {
          italics: true,
          alignment: 'right'
        }
      }
    };

    // pdfMake.tableLayouts = {
    //   exampleLayout: {
    //     hLineWidth: function (i, node) {
    //       if (i === 0 || i === node.table.body.length) {
    //         return 0;
    //       }
    //       return (i === node.table.headerRows) ? 2 : 1;
    //     },
    //     vLineWidth: function (i) {
    //       return 0;
    //     },
    //     hLineColor: function (i) {
    //       return i === 1 ? 'black' : '#aaa';
    //     },
    //     paddingLeft: function (i) {
    //       return i === 0 ? 0 : 8;
    //     },
    //     paddingRight: function (i, node) {
    //       return (i === node.table.widths.length - 1) ? 0 : 8;
    //     }
    //   }
    // };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.payUrl = dataUrl;
    });

    // pdfDocGenerator.getBlob((blob) => {
    //   this.payUrl = blob;
    // });
  }

  openPayslipDialog(templateRef: TemplateRef<any>, element) {
    let dialogRef = this.dialog.open(templateRef, {
      width: "800px",
      height: "600px",
    });
    this.getPayrollDetails(element);

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  onClose() {
    this.dialog.closeAll();
  }

  openDatePicker(dp) {
    dp.open();
  }

  closeDatePicker(eventData: any, dp?: any) {
    // get month and year from eventData and close datepicker, thus not allowing user to select date
    dp.close();
  }
}
