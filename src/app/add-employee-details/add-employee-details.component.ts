import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MatStepper } from '@angular/material';
import { EmployeeService } from '../shared/services/employee.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-employee-details',
  templateUrl: './add-employee-details.component.html',
  styleUrls: ['./add-employee-details.component.css']
})
export class AddEmployeeDetailsComponent implements OnInit {

  personalDetailsFormGroup: FormGroup;
  bankDetailsFormGroup: FormGroup;
  ctcDetailsFormGroup: FormGroup;
  date: string;
  personalFormDetails: any = [];
  bankFormDetails: any = [];
  ctcFormDetails: any = [];
  CTCComponentsDetails: any[] = [];
  calculatedPayroll: any[] = [];
  durationInSeconds = 5;
  @ViewChild('stepper', {static: true}) private stepper: MatStepper;
  constructor(public dialogRef: MatDialogRef<AddEmployeeDetailsComponent>, private _formBuilder: FormBuilder,
    private employeeService: EmployeeService, private _snackBar: MatSnackBar) {
      let currentDate = new Date();
      this.date = formatDate(currentDate, 'dd/MM/yyyy HH:mm:ss', 'en-US');
      this.getCTCCompoenets();
    }

  ngOnInit() {
    this.personalDetailsFormGroup = this._formBuilder.group({
    firstName: ['Kritika', Validators.required],
    // empId: ['', Validators.required],
    lastName: ['Sharma', Validators.required],
    dateOfBirth: ['', Validators.required],
    dateOfJoining: ['', Validators.required],
    dateOfExit: [''],
    pan: ['567687576', Validators.required],
    aadhaar: ['345564536454', Validators.required],
    permenantAddress: ['#5476', Validators.required],
    correspondenceAddress: ['#6576'],
    uanNo: ['656789', Validators.required],
    pfNo: ['67789', Validators.required],
  });
  this.bankDetailsFormGroup = this._formBuilder.group({
    bankAcctNo: ['789876677', Validators.required],
    bankAcctName: ['Kritika Sharma', Validators.required],
    bankAcctAddress: ['abc', Validators.required],
    bankIFSC: ['5678999', Validators.required],
  });
  this.ctcDetailsFormGroup = this._formBuilder.group({
    basicPay: ['30000', Validators.required],
    hra: ['12000', Validators.required],
    specialAllowance: ['30000', Validators.required],
    conveyanceAllowance: ['20000', Validators.required],
    pf: ['3000', Validators.required],
    lta: ['40000', Validators.required],
    paytm: ['2000', Validators.required],
    gratuity: ['50000', Validators.required],
    standardDeductions: ['3000', Validators.required],
    welfareContribution: ['56798', Validators.required],
    joiningBonus: ['4567', Validators.required],
    grossSalary: [''],
    totalFlexiBasket: [''],
    ctc: ['']
    // variable: ['', Validators.required],
  });
  }

  getCTCCompoenets() {
    // this.employeeService.getCTCComponentsApi().subscribe(
      this.employeeService.getAllCTCComponentsApi().subscribe(
      res => {
        this.CTCComponentsDetails = res.data;
        console.log('get all CTC Components details res', this.CTCComponentsDetails);
      },
      error => {
        console.log('get all CTC Components details failed', error);
      }
    );
  }

  postEmployeeDetails() {
    if (this.personalDetailsFormGroup.valid) {
    let element = {
      cityType: "M",
      // employeeId: this.personalDetailsFormGroup.get('empId').value,
      firstName: this.personalDetailsFormGroup.get('firstName').value,
      lastName: this.personalDetailsFormGroup.get('lastName').value,
      dateOfBirth: moment(this.personalDetailsFormGroup.get('dateOfBirth').value).format('DD/MM/yyyy HH:mm:ss'),
      dateOfJoining: moment(this.personalDetailsFormGroup.get('dateOfJoining').value).format('DD/MM/yyyy HH:mm:ss'),
      dateOfExit: this.personalDetailsFormGroup.get('dateOfExit').value ? moment(this.personalDetailsFormGroup.get('dateOfExit').value).format('DD/MM/yyyy HH:mm:ss') : '',
      bankAcctNo: this.bankDetailsFormGroup.get('bankAcctNo').value,
      bankAcctAddress: this.bankDetailsFormGroup.get('bankAcctAddress').value,
      bankAcctName: this.bankDetailsFormGroup.get('bankAcctName').value,
      bankIFSC: this.bankDetailsFormGroup.get('bankIFSC').value,
      aadhaar: this.personalDetailsFormGroup.get('aadhaar').value,
      permenantAddress: this.personalDetailsFormGroup.get('permenantAddress').value,
      correspondenceAddress: this.personalDetailsFormGroup.get('correspondenceAddress').value,
      uanNo: this.personalDetailsFormGroup.get('uanNo').value,
      pfNo: this.personalDetailsFormGroup.get('pfNo').value,
      pan: this.personalDetailsFormGroup.get('pan').value,
      rowInsertBy: "ragupta",
      rowInsertDate: this.date,
      rowUpdateBy: "ragupta",
      rowUpdateDate: this.date,
      status: "ACTIVE"
    }
    console.log('element', element);
    this.employeeService.postEmployeeDetailsApi(element).subscribe(
      res => {
        console.log('addEmployeeService res', res);
        this.postEmployeeCTCDetails(res.data.employeeId);
      },
      error => {
        console.log('addEmployeeService failed', error);
      }
    );
    }
  }

  postEmployeeCTCDetails(empId: any) {
    if (this.ctcDetailsFormGroup.valid) {
    let data = [
    {
      "amount": this.ctcDetailsFormGroup.get('basicPay').value,
      "ctcComponent": "BASIC_PAY",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
   {
      "amount": this.ctcDetailsFormGroup.get('hra').value,
      "ctcComponent": "HRA",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
   {
      "amount": this.ctcDetailsFormGroup.get('conveyanceAllowance').value,
      "ctcComponent": "CONVEYANCE_ALLOWANCE",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
   {
      "amount": this.ctcDetailsFormGroup.get('joiningBonus').value,
      "ctcComponent": "BONUS",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
   {
    "amount": this.ctcDetailsFormGroup.get('specialAllowance').value,
    "ctcComponent": "SPECIAL_ALLOWANCE",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
   {
      "amount": this.ctcDetailsFormGroup.get('standardDeductions').value,
      "ctcComponent": "STANDARD_ALLOWANCE",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
   {
      "amount": this.ctcDetailsFormGroup.get('welfareContribution').value,
      "ctcComponent": "WELFARE_CONTRIBUTION",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
    {
      "amount": this.ctcDetailsFormGroup.get('pf').value,
      "ctcComponent": "PF",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
    {
      "amount": this.ctcDetailsFormGroup.get('lta').value,
      "ctcComponent": "LTA",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
    {
      "amount": this.ctcDetailsFormGroup.get('paytm').value,
      "ctcComponent": "PAYTM",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
    {
      "amount": this.ctcDetailsFormGroup.get('gratuity').value,
      "ctcComponent": "GRATUITY",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
    {
      "amount": this.ctcDetailsFormGroup.get('grossSalary').value,
      "ctcComponent": "GROSS_SALARY",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
    {
      "amount": this.ctcDetailsFormGroup.get('ctc').value,
      "ctcComponent": "CTC",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
    {
      "amount": this.ctcDetailsFormGroup.get('totalFlexiBasket').value,
      "ctcComponent": "TOTAL_FLEXI_BASKET",
      "employeeId": empId,
      "fiscal": "2021",
      "notes": "Some random text to see the change in CTC",
      "rowInsertBy": "string",
      "rowInsertDate": "20/12/2020 20:20:20",
      "rowUpdateBy": "string",
      "rowUpdateDate": "20/12/2020 20:20:20",
      "status": "ACTIVE"
    },
  ]
    this.employeeService.postEmployeeCTCDetailsApi(data).subscribe(
      res => {
        this.onClose();
        console.log('postEmployeeCTCDetails res', res);
        this.openSnackbar('Details submitted successfully!!', 'Close');
        setTimeout(() => {
        window.location.reload();
      }, 2000);
      },
      error => {
        this.openSnackbar('Failed to submit details!!', 'Close');
        console.log('postEmployeeCTCDetails failed', error);
      }
    );
    }
  }

  getFormDetails() {
    this.personalFormDetails = Object.keys(this.personalDetailsFormGroup.value).map(key => ({type: key, value: this.personalDetailsFormGroup.value[key]}));
    this.bankFormDetails = Object.keys(this.bankDetailsFormGroup.value).map(key => ({type: key, value: this.bankDetailsFormGroup.value[key]}));
    this.ctcFormDetails = Object.keys(this.ctcDetailsFormGroup.value).map(key => ({type: key, value: this.ctcDetailsFormGroup.value[key]}));
    // console.log(this.personalFormDetails, this.bankFormDetails, this.ctcFormDetails);
  }

  checkDateType(value: any) {
    if (value instanceof Date) {
      return true;
    }
    return false;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  calculateCTC() {
    let data = [
      {
      "ctcComponent":"BASIC_PAY",
      "amount": this.ctcDetailsFormGroup.get('basicPay').value,
      },
      {
      "ctcComponent":"HRA",
      "amount": this.ctcDetailsFormGroup.get('hra').value,
      },
      {
      "ctcComponent":"CONVEYANCE_ALLOWANCE",
      "amount": this.ctcDetailsFormGroup.get('conveyanceAllowance').value,
      },
      {
      "ctcComponent":"BONUS",
      "amount": this.ctcDetailsFormGroup.get('joiningBonus').value,
      },
      {
      "ctcComponent":"SPECIAL_ALLOWANCE",
      "amount": this.ctcDetailsFormGroup.get('specialAllowance').value,
      },
      {
      "ctcComponent":"STANDARD_ALLOWANCE",
      "amount": this.ctcDetailsFormGroup.get('standardDeductions').value,
      },
      {
      "ctcComponent":"WELFARE_CONTRIBUTION",
      "amount": this.ctcDetailsFormGroup.get('welfareContribution').value,
      },
      {
        "ctcComponent":"GRATUITY",
        "amount": this.ctcDetailsFormGroup.get('gratuity').value,
        },
      {
        "ctcComponent":"PF",
        "amount": this.ctcDetailsFormGroup.get('pf').value,
      },
      {
        "ctcComponent":"PAYTM",
        "amount": this.ctcDetailsFormGroup.get('paytm').value,
      },
      {
        "ctcComponent":"LTA",
        "amount": this.ctcDetailsFormGroup.get('lta').value,
      }
      ]
    this.employeeService.calculateCTCApi(data).subscribe(
      res => {
        this.calculatedPayroll = res.data;
        console.log('calculateCTC res', res.data);
        this.ctcDetailsFormGroup.get('grossSalary').setValue(this.calculatedPayroll[0].amount);
        this.ctcDetailsFormGroup.get('ctc').setValue(this.calculatedPayroll[1].amount);
        this.ctcDetailsFormGroup.get('totalFlexiBasket').setValue(this.calculatedPayroll[2].amount);
      },
      error => {
        console.log('calculateCTC failed', error);
      }
    );
  }

  openSnackbar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }
}
