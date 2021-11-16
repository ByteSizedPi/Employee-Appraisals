import { Observable, Subject } from 'rxjs';
import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppraisalSummaryService {
  public scoresObservable = new Subject();
  private scores = [];

  constructor() {}

  calc(appraisal) {
    var isCompleted;
    var employeeValues;
    const managerValues = JSON.parse(appraisal["manager_score"]);
    if (isCompleted = (appraisal["state"] === "completed")) {
      employeeValues = JSON.parse(appraisal["employee_score"]);
    }
    this.scores = [];

    managerValues.forEach((section: [], i) => {
      let total = 0;
      let empScore = 0;
      let manScore = 0;

      section.forEach((subsection: [], j) => {
        subsection.forEach((question, k) => {
          total++;
          manScore += question;
          empScore += isCompleted ? employeeValues[i][j][k] : 0;
        })
      })
      this.scores.push([manScore, empScore, total]);
    });
    this.scoresObservable.next({appraisal: appraisal, scores: this.scores});
  }
}
