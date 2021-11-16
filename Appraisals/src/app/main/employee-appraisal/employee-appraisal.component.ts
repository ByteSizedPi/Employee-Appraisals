import { TestDbConnectionService } from './../../test-db-connection.service';
import { HttpClient } from '@angular/common/http';
import { AppraisalSummaryService } from './../../appraisal-summary.service';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/database.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-employee-appraisal',
  templateUrl: './employee-appraisal.component.html',
  styleUrls: ['./employee-appraisal.component.scss']
})
export class EmployeeAppraisalComponent implements OnInit {
  public dataFetched = false;

  private allEmployees = [];
  private allAppraisals = [];
  private allPendingAppraisals = [];

  public filteredEmployees = [];
  public filteredAppraisals = [];
  public filteredPendingAppraisals = [];

  constructor(private db: DatabaseService, private dbErr: TestDbConnectionService, private router: Router,
    private summaryService: AppraisalSummaryService) { }

  ngOnInit(): void {
    // this.db.setCurManager(this.db.getCurUser());
    // this.db.getAllEmployees()
    //   .then((employees: []) => {
    //     this.filteredEmployees = this.allEmployees = employees;
    //     this.db.getAppraisalsByManagerWithName(this.db.getCurUser()["username"])
    //       .subscribe((appraisals: []) => {
    //         this.filteredPendingAppraisals = this.allPendingAppraisals =
    //           (this.filteredAppraisals = this.allAppraisals = appraisals)
    //             .filter(app => app["state"] === "pending");
    //         this.dataFetched = true;
    //       }, err => this.dbErr.error(err))
    //   })
    this.dataFetched = true;
  }

  searchAppraisals(arrName, event) {
    this[`filtered${arrName}`] = this[`all${arrName}`]
      .filter(employee => {
        return (employee["employee_username"] + employee["name"]).toLowerCase()
          .search(event.target.value.toLowerCase()) !== -1;
      })
  }

  searchEmployees(arrName, event) {
    this[`filtered${arrName}`] = this[`all${arrName}`]
      .filter(employee => {
        return (employee["username"] + employee["name"]).toLowerCase()
          .search(event.target.value.toLowerCase()) !== -1;
      })
  }

  date(date: string) {
    return date.replace(/\-|:+/g, '/').split('T')[0];
  }

  getClass(str: string, state: string) {
    switch (state) {
      case "pending": return str + "primary";
      case "completed": return str + "success";
      case "cancelled": return str + "warning";
      case "missed": return str + "danger";
      default: return str + " primary";
    }
  }

  sort(arrName, str: string) {
    this[`filtered${arrName}`].sort((a, b) => a[str].toLowerCase() > b[str].toLowerCase() ? 1 : -1);
  }

  submit(employee) {
    this.db.setCurEmployee(employee);
    this.router.navigate(['/new']);
  }

  showSummary(appraisal) {
    this.summaryService.calc(appraisal);
  }

  cancel(appraisal) {
    if (confirm("are you sure you want to cancel appraisal for: " + appraisal["employee_username"])) {

      const data = {
        id: appraisal["appraisal_id"]
      }

      this.db.cancelAppraisal(data)
        .subscribe(results => {
          this.router.navigateByUrl('/main', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/main/employee']);
          });
        }, err => this.dbErr.error(err));
    }
  }

}
