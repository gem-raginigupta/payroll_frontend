import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
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
  personalFormDetails: any;
  bankFormDetails: any;
  ctcFormDetails: any;
  constructor(public dialogRef: MatDialogRef<AddEmployeeDetailsComponent>, private _formBuilder: FormBuilder,
    private employeeService: EmployeeService) {
      let currentDate = new Date();
      this.date = formatDate(currentDate, 'dd/MM/yyyy HH:mm:ss', 'en-US');
    }

  ngOnInit() {
    this.personalDetailsFormGroup = this._formBuilder.group({
    firstName: ['Ragini', Validators.required],
    // empId: ['', Validators.required],
    lastName: ['Gupta', Validators.required],
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
    bankAcctName: ['Ragini Gupta', Validators.required],
    bankAcctAddress: ['abc', Validators.required],
    bankIFSC: ['5678999', Validators.required],
  });
  this.ctcDetailsFormGroup = this._formBuilder.group({
    basicPay: ['30000', Validators.required],
    hra: ['12000', Validators.required],
    specialAllowance: ['30000', Validators.required],
    conveyanceAllowance: ['20000', Validators.required],
    pf: ['2200', Validators.required],
    standardDeductions: ['3000', Validators.required],
    welfareContribution: ['56798', Validators.required],
    joiningBonus: ['4567', Validators.required],
    variable: ['30000', Validators.required],
  });
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
      dateOfExit: moment(this.personalDetailsFormGroup.get('dateOfExit').value).format('DD/MM/yyyy HH:mm:ss'),
      bankAcctNo: this.personalDetailsFormGroup.get('bankAcctNo').value,
      bankAcctAddress: this.bankDetailsFormGroup.get('bankAcctAddress').value,
      bankAcctName: this.bankDetailsFormGroup.get('bankAcctName').value,
      bankIFSC: this.bankDetailsFormGroup.get('bankIFSC').value,
      aadhaar: this.bankDetailsFormGroup.get('aadhaar').value,
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
      },
      error => {
        console.log('addEmployeeService failed', error);
      }
    );
    }
  }

  postEmployeeCTCDetails() {
    if (this.ctcDetailsFormGroup.valid) {
    let element = {
      cityType: "",
      employeeId: "GSI G 710",
      firstName: this.ctcDetailsFormGroup.get('firstName').value,
      lastName: this.ctcDetailsFormGroup.get('lastName').value,
      residentialAddress: this.ctcDetailsFormGroup.get('perAddress').value,
      rowInsertBy: "ragupta",
      rowInsertDate: this.date,
      rowUpdateBy: "ragupta",
      rowUpdateDate: this.date,
      status: ""
    }
    console.log('element', element);
    this.employeeService.postEmployeeDetailsApi(element).subscribe(
      res => {
        console.log('addEmployeeService res', res);
      },
      error => {
        console.log('addEmployeeService failed', error);
      }
    );
    }
  }

  postDetails() {
    this.postEmployeeDetails();
  }

  getFormDetails() {
    let mapped1 = Object.keys(this.personalDetailsFormGroup.value).map(key => ({type: key, value: this.personalDetailsFormGroup.value[key]}));
    this.personalFormDetails = mapped1;
    let mapped2 = Object.keys(this.bankDetailsFormGroup.value).map(key => ({type: key, value: this.bankDetailsFormGroup.value[key]}));
    this.bankFormDetails = mapped2;
    let mapped3 = Object.keys(this.ctcDetailsFormGroup.value).map(key => ({type: key, value: this.ctcDetailsFormGroup.value[key]}));
    this.ctcFormDetails = mapped3;
    console.log(this.personalFormDetails. this.bankFormDetails, this.ctcFormDetails);
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
}
