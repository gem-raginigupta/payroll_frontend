import { Component, HostListener, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  openNotifications(event) {
    this.showNotifications = !this.showNotifications
    event.stopPropagation();
    if (this.showNotifications) {
      // this.readNotifications();
    }
  }

}
