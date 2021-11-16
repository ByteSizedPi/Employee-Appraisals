import { AppraisalSummaryService } from './../appraisal-summary.service';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/database.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public user = null;
  constructor(private db: DatabaseService, private router: Router) {
    // this.user = this.db.getCurUser();
    this.user = {
      name: 'Johan',
      rank : 'manager',
      username: 'johan@gmail.com',
      department: 'sales'
    };
  }

  ngOnInit(): void {
  }

  logout() {
    this.db.logout();
    this.router.navigate(["/"]);
  }

}
