import { DatabaseService } from './../database.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  public user: any = {};

  constructor(private router: Router, private db: DatabaseService) {
      this.user = db.getCurUser();
    }

  ngOnInit(): void {
  }

  logout() {
    if (confirm("Are you sure you want to log out?")) {
      this.db.logout();
      this.router.navigate(["/"]);
    }
  }

}
