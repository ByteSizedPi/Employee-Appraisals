import { TestDbConnectionService } from './../../test-db-connection.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';

@Component({
  selector: 'app-appraisal',
  templateUrl: './appraisal.component.html',
  styleUrls: ['./appraisal.component.scss']
})
export class AppraisalComponent implements OnInit {
  public templates = [];
  public numbers = [1, 2, 3, 4, 5];
  public template = { "template": [] };
  public scores = [];
  public parsed = false;
  public formValid = true;
  public isEmployee = true;

  constructor(private db: DatabaseService, private router: Router, private dbErr: TestDbConnectionService) { }

  ngOnInit(): void {
    if (this.db.suffRank(2)) this.isEmployee = false;

    this.db.getAllTemplates()
      .subscribe((templates: []) => {
        this.templates = templates;
        const defaultTemplate = this.isEmployee ? this.db.getCurAppraisal()["template_id"] : 3;

        this.db.getTemplateByID(defaultTemplate)
          .subscribe((temp: any) => {
            this.template = this.convertTemplate(temp[0]);
            this.setScores();
            this.parsed = true;
          }, err => this.dbErr.error(err));
      }, err => this.dbErr.error(err));
  }

  getEmployee() {
    const emp = this.db.getCurEmployee();
    return `${emp["name"]} (${emp["username"]})`;
  }

  setScores() {
    this.scores = [];
    this.template.template.forEach((section, i) => {
      this.scores.push([]);
      section.subsections.forEach((subsection, j) => {
        this.scores[i].push([]);
        if (!subsection.questions) subsection.questions = [];
        subsection.questions.forEach(() => {
          this.scores[i][j].push(0);
        });
      });
    });
  }

  setTemplate(id: string) {
    this.template = this.convertTemplate(this.templates.find(temp => temp["template_id"] === id));
    this.setScores();
  }

  convertTemplate = temp => { return { ...temp, template: JSON.parse(temp["template_object"]) } }

  setVal(i, j, k, value: number) {
    document.getElementById(i + '' + j + '' + k).classList.remove("red-border");
    this.scores[i][j][k] = value;
  }

  sum(i: number) {
    let total = 0;
    this.scores[i].forEach(subsection => subsection.forEach(question => total += question));
    return total;
  }

  validateForm() {
    this.formValid = true;
    this.scores.forEach((section, i) => {
      section.forEach((subsection, j) => {
        subsection.forEach((question, k) => {
          if (question === 0) {
            this.formValid = false;
            document.getElementById(i + '' + j + '' + k).classList.add("red-border");
          }
        });
      });
    });
  }

  submit() {

    this.validateForm();

    if (this.formValid && confirm("Are you sure you want to submit the Appraisal?")) {
      this[`${this.isEmployee ? "update" : "post"}Appraisal`]()
        .then(this.route)
        .catch(error => this.dbErr.error(error));
    } else {
      alert("All fields are required");
    }
  }

  route = () => this.router.navigate([`main/${this.db.suffRank(2) ? 'employee' : 'self'}`]);

  postAppraisal = () => new Promise((resolve, reject) => {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const data = {
      "manager_username": this.db.getCurManager()["username"],
      "employee_username": this.db.getCurEmployee()["username"],
      "template_id": this.template["template_id"],
      "date_created": date,
      "date_due": date,
      "manager_score": JSON.stringify(this.scores),
      "employee_score": null,
      "state": "pending",
    }

    this.db.postAppraisal(data)
      .subscribe(resolve, err => reject(err));
  });

  updateAppraisal = () => new Promise((resolve, reject) => {
    const data = {
      scores: JSON.stringify(this.scores),
      id: this.db.getCurAppraisal()["appraisal_id"]
    }

    this.db.completeAppraisal(data)
    .subscribe(resolve, err => reject(err));
  });
}
