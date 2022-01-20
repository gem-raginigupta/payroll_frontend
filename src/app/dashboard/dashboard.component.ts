import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  showNotifications: boolean = false;
  notifications: any = [];

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    this.showNotifications = false;
  }

  public user: SocialUser;
  constructor(private dialog: MatDialog, private router: Router) {
    this.user = JSON.parse(sessionStorage.getItem('user')) as SocialUser;
  }

  ngOnInit() {
    // console.log('user', this.user);
  }

  openNotifications(event) {
    this.showNotifications = !this.showNotifications
    event.stopPropagation();
    if (this.showNotifications) {
      // this.readNotifications();
    }
  }

  openLogout(templateRef: TemplateRef<any>) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '280px',
      height: '140px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  signOut(): void {
    if (sessionStorage.getItem('user') !== null) {
      sessionStorage.removeItem('user');
      this.dialog.closeAll();
      this.router.navigate(['/login']);
    } else {
      console.log('user not logged in');
    }
  }

}
