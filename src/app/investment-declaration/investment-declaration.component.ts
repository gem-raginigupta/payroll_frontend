import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatTableModule } from '@angular/material';
import { EmployeeService } from '../shared/services/employee.service';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'investment-declaration',
  templateUrl: './investment-declaration.component.html',
  styleUrls: ['./investment-declaration.component.css']
})

export class InvestmentDeclarationComponent {
    constructor(public dialog: MatDialog, private employeeService: EmployeeService, private formBuilder: FormBuilder) {
     }
    allEmpDetails: any;
    empListDataSource: any;
    employeeIds: any;
    show80C: any;
    show80D: any;
    investment_option: any;
    investment_declarations: any;
    investmentDeclarationlist: any;
    investmentDeclarationForm: any;
    investmentDeclarationDict: any;
    allInvestmentDeclarations: any;
    investmentDeclarationvalue: any;
    investment_sum:any;
    formgroup: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    ngOnInit() {
      this.formgroup = {}
      this.formgroup['employeeid'] = []
      this.formgroup['fiscal'] = []
      this.investmentDeclarationvalue= {}
      this.getInvestmentDelarations();
      this.getInvestmentBySection('80C');
      this.getInvestmentBySection('80D');
      this.display();
      this.getAllEmployees();
      this.investment_sum = 0;
      this.show80C = false;
      this.show80D = false;
    }

    display(){
      console.log("Yo!!!")
    }

    sum(key, value){
      console.log(key,value);
      if(!value){
        value = 0
      }
      this.investmentDeclarationvalue[key] = parseInt(value);
      let obj = this.investmentDeclarationvalue;
      this.investment_sum = 0
      for( var k in obj ) {
        if( obj.hasOwnProperty( k ) ) {
          this.investment_sum += parseFloat( obj[k] );
        }
      }
    }

    displayDec(section){
      this.show80C = !this.show80C;
      this.getInvestmentBySection(section);
    }

    display80C(){
      this.show80C = !this.show80C;
      this.show80D = false;
      this.getInvestmentBySection('80C');
    }

    display80D(){
      console.log("Clicked")
      this.show80D = !this.show80D;
      this.show80C = false;
      this.getInvestmentBySection('80D');
    }

    getAllEmployees(){
        this.employeeService.getAllEmployeesDetailsApi().subscribe(
            res => {
              this.allEmpDetails = res.data;
              this.empListDataSource = new MatTableDataSource<any>(this.allEmpDetails);
              this.empListDataSource.sort = this.sort;
              this.empListDataSource.paginator = this.paginator;
              this.employeeIds = this.parseEmployeeId();
              console.log('get all emp details res', this.employeeIds);
            },
            error => {
              console.log('get all emp details failed', error);
            }
          );
    }
    parseEmployeeId(){
        this.employeeIds = []
        for (let i = 0; i < this.allEmpDetails.length; i++){
            this.employeeIds.push(this.allEmpDetails[i]['employeeId'])
        }
        return this.employeeIds;
    }
    onSubmit() {
        console.log(this.investmentDeclarationForm.value);
        const res = this.investmentDeclarationForm.value;
        let keys = Object.keys(res)
        for (let i = 2; i < keys.length; i++){
          if(res[keys[i]] != null){
            let inv_id = this.investmentDeclarationDict[keys[i]]
            let amount = res[keys[i]]
            let payload = {}
            payload['employeeId'] = res['employeeid']
            payload['fiscal'] = res['fiscal']
            payload['status'] = 'Active'
            payload['rowInsertBy'] = 'ujsharma'
            payload['rowInsertDate'] =  "20/12/2020 20:20:20"
            payload['rowUpdateDate'] =  "20/12/2020 20:20:20"
            payload['rowUpdateBy'] = 'ujsharma'
            payload['amount'] = amount
            payload['investmentViaId'] = inv_id
            console.log(payload)
            this.employeeService.postInvestmentDeclarationAPI(payload).subscribe(
              result => {
                console.log(result);
              }
            )
          }
        }
    }
    getInvestmentDelarations() {
      this.allInvestmentDeclarations = []
      this.employeeService.getInvestmentDelarationSectionApi().subscribe(
        res => {
          this.investment_declarations = res.data;
          for(let i=0; i< res.data.length; i++){
            this.allInvestmentDeclarations.push(res.data[i]['optionValue'])
            // this.getInvestmentBySection(this.investment_option);
          }
        }
      )
    }
    getInvestmentBySection(section) {
      this.employeeService.getInvestmentBySectionApi(section).subscribe(
        res => {
          this.investmentDeclarationlist = []
          this.investmentDeclarationDict = {}
          for (let i = 0; i < res.data.length; i++){
              this.investmentDeclarationDict[res.data[i]['investmentType']] = res.data[i]['investmentViaId']
              this.investmentDeclarationlist.push(res.data[i]['investmentType']);
              console.log(res.data[i]['investmentType']);
              this.investmentDeclarationvalue[res.data[i]['investmentType']] = 0;
              this.formgroup[res.data[i]['investmentType']] = []
          }
          this.investmentDeclarationForm = this.formBuilder.group(this.formgroup);
          console.log(this.formgroup);
          console.log(this.investmentDeclarationlist);
          console.log(this.investmentDeclarationvalue);
        }
      )
    }
  }
  