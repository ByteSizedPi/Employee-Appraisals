import { DatabaseService } from 'src/app/database.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appraisal-list',
  templateUrl: './appraisal-list.component.html',
  styleUrls: ['./appraisal-list.component.scss']
})
export class AppraisalListComponent implements OnInit {
  public appraisals: [];

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {
  }

}
