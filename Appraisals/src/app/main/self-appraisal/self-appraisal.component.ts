import { TestDbConnectionService } from './../../test-db-connection.service';
import { Router } from '@angular/router';
import { DatabaseService } from './../../database.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-self-appraisal',
  templateUrl: './self-appraisal.component.html',
  styleUrls: ['./self-appraisal.component.scss']
})
export class SelfAppraisalComponent implements OnInit {
  private allAvailable = [];
  private allAppraisals = [];

  public filteredAvailable = [];
  public filteredAppraisals = [];

  public manager = {};
  public dataFetched = false;

  constructor(private db: DatabaseService, private router: Router, private dbErr: TestDbConnectionService) { }

  ngOnInit(): void {
    this.db.setCurEmployee(this.db.getCurUser());
    this.db.getAppraisalsByEmployee(this.db.getCurUser()["username"])
      .subscribe((appraisals: []) => {
        this.filteredAvailable = this.allAvailable =
          (this.filteredAppraisals = this.allAppraisals = appraisals)
            .filter(appraisal => appraisal["state"] === "pending");
        this.db.getManagerByDepartment(this.db.getCurUser()["department"])
        .subscribe(manager => {
          this.manager = manager[0];
          this.dataFetched = true;
        }, err => this.dbErr.error(err));
      }, err => this.dbErr.error(err))
  }

  sort(arrName, str: string) {
    this[`filtered${arrName}`].sort((a, b) => a[str] > b[str] ? 1 : -1);
  }

  date(date: string) {
    return date.replace(/\-|:+/g, '/').split('T')[0];
  }

  getClass(str: string, state: string) {
    switch(state) {
      case "pending": return str + "primary";
      case "completed": return str + "success";
      case "cancelled": return str + "warning";
      case "missed": return str + "danger";
      default: return str + " primary";
      }   
  }

  submit(appraisal) {
    this.db.setCurAppraisal(appraisal);
    this.router.navigate(['/new']);
  }

}
