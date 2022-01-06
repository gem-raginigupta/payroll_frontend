import { Component, ElementRef, OnInit,TemplateRef, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
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
  files: any[] = [];
  employeeCalculatedDetails: any;
  private selectedFile: File;
  durationInSeconds = 5;
  @ViewChild('fileInp', {static: false}) fileInp: ElementRef;

  empDetails: any = [
    {header: 'Permanent Address', field: 'permenantAddress'},
    {header: 'Correspondence Address', field: 'correspondenceAddress'},
    {header: 'Permenant Account Number', field: 'pan'},
    {header: 'UAN Number', field: 'uanNo'},
    {header: 'PF Number', field: 'pfNo'},
    {header: 'Bank Account Number', field: 'bankAcctNo'},
    {header: 'Bank Account Name', field: 'bankAcctName'},
    {header: 'Bank Account Address', field: 'bankAcctAddress'},
    {header: 'Bank IFSC', field: 'bankIFSC'}
  ];

  public empListDataSource: MatTableDataSource<any>;
  constructor(public dialog: MatDialog, private employeeService: EmployeeService, private _snackBar: MatSnackBar) { }
  displayedColumns: string[] = ['expand_action', 'id', 'name', 'doj', 'dob', 'doe', 'cityType', 'aadhaar', 'status'];
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

  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    // console.log(this.selectedFile.name);
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
      if (this.expandedElement === element)
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

    uploadBulkData() {
      const formData = new FormData();
      formData.append('file', this.files[0]);
      if (!this.files[0]) {
        alert('Select a file to continue.');
      }
      this.employeeService.postBulkFileUploadApi(formData).subscribe(
          res => {
            this.openSnackbar(res.msg, 'Close');
            if (res.msg === 'SUCCESS') {
              this.dialog.closeAll();
            }
            console.log(res, 'Files uploaded');
          },
          error => {
            this.openSnackbar('Failed to upload file', 'Close');
            console.log('Files uploading failed', error);
          }
        );
    }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    // console.log('files', files);
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    console.log(this.fileInp.nativeElement.value);
    this.fileInp.nativeElement.value = '';
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    // console.log('files', files);
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes) {
    let decimals;
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
    //-------------------

      // getEmployeeCTCDetails(element) {
      //   const grossDetails = this.employeeService.getEmployeeCTCDetailsApi(element.employeeId);
      //   const calculatedDetails = this.employeeService.getCalculatedDetailsApi(element.employeeId);
      //   forkJoin([grossDetails, calculatedDetails]).subscribe(
      //     res => {
      //       console.log('getEmployeeCTCDetailsApi res', res[0]);
      //       this.employeeCTCDetails = res[0].data;

      //       console.log('getEmployeeCalculatedDetailsApi res', res[1]);
      //       this.employeeCalculatedDetails = res[1].data;
      //     });
      //     }

      openUploadFilesDialog(templateRef: TemplateRef<any>) {
        let dialogRef = this.dialog.open(templateRef, {
          width: "800px",
          height: "600px",
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log("The dialog was closed");
        });
      }

      onClose() {
        this.dialog.closeAll();
      }

      openSnackbar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: this.durationInSeconds * 1000,
        });
      }
}
