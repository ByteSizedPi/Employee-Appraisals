import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppraisalSummaryService } from './../appraisal-summary.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public appraisal;
  public scores = [];
  public canShow = false;

  constructor(private summary: AppraisalSummaryService) { }

  ngOnInit(): void {
    this.subscription = this.summary.scoresObservable.subscribe((appraisal: {}) => {
      this.appraisal = appraisal["appraisal"];
      this.scores = appraisal["scores"];
      this.canShow = true;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  section(index: number) {
    return String.fromCharCode(index + 65);
  }

  close() {
    this.canShow = false;
  }
}
