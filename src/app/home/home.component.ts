import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  personalDetailsFormGroup: FormGroup;
  bankDetailsFormGroup: FormGroup;
  ctcDetailsFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.personalDetailsFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      // middleName: [''],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      doj: ['', Validators.required],
      doe: [''],
      acctNo: ['', Validators.required],
      aadharNo: ['', Validators.required],
      perAddress: ['', Validators.required],
      corrAddress: [''],
      uanNo: ['', Validators.required],
      pnNo: ['', Validators.required],
    });
    this.bankDetailsFormGroup = this._formBuilder.group({
      bankAccountNo: ['', Validators.required],
      bankAccountName: ['', Validators.required],
      bankAccountAddress: ['', Validators.required],
      bankAccountIFSC: ['', Validators.required],
    });
    this.ctcDetailsFormGroup = this._formBuilder.group({
      basicPay: ['', Validators.required],
      hra: ['', Validators.required],
      specialAllowance: ['', Validators.required],
      conveyanceAllowance: ['', Validators.required],
      pf: ['', Validators.required],
      standardDeductions: ['', Validators.required],
      groupHealthInsurance: ['', Validators.required],
      grossSalary: ['', Validators.required],
      joiningBonus: ['', Validators.required],
      variable: ['', Validators.required],
      gratuityBenefitsTotalCTC: ['', Validators.required],
    });
  }
}
