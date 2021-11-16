import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/database.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.component.html',
  styleUrls: ['./new-template.component.scss']
})
export class NewTemplateComponent implements OnInit {
  public allTemplates = [];
  public isLoaded = false;

  public name: FormGroup;

  public newTemplate: {
    section: string,
    title: string,
    objective: string,
    subsections: {
      title: string,
      questions: string[]
    }[],
  }[] = [];

  constructor(private db: DatabaseService, private router: Router) { }

  ngOnInit(): void {
    this.db.getAllTemplates()
      .subscribe((templates: []) => {
        this.allTemplates = templates;
        this.isLoaded = true;
      });

    this.name = new FormGroup({
      'name': new FormControl(null, Validators.required, this.verifyName.bind(this)),
    });
  }

  verifyName = (control: FormControl) => new Promise(resolve => {
    const len = this.allTemplates.filter(template => template["template_name"] === control.value).length;
    resolve(len > 0 ? { msg: "Exists" } : null);
  });

  isEmpty() {
    return this.name.get("name").touched && !this.name.get("name").value;
  }

  isUnique() {
    return (this.name.valid || !this.name.get('name').touched || !this.name.get('name').value);
  }

  templateIsValid() {
    return !!this.newTemplate[0]?.subsections[0]?.questions.length;
  }

  appendSection() {
    const section = String.fromCharCode(65 + this.newTemplate.length);
    this.newTemplate.push(
      {
        section: section,
        title: "",
        objective: "",
        subsections: []
      }
    );
  }

  popSection() {
    this.newTemplate.pop();
  }

  appendSubsection(i: number) {
    this.newTemplate[i].subsections.push(
      {
        title: "",
        questions: []
      }
    );
  }

  popSubsection(i: number) {
    this.newTemplate[i].subsections.pop();
  }

  appendQuestion(i: number, j: number) {
    this.newTemplate[i].subsections[j].questions.push(
      ""
    )
  }

  popQuestion(i: number, j: number) {
    this.newTemplate[i].subsections[j].questions.pop();
  }

  setAllValues() {
    this.newTemplate.forEach((section, i) => {
      this.newTemplate[i].title = (<HTMLInputElement>document.getElementById(`title-${i}`)).value;
      this.newTemplate[i].objective = (<HTMLInputElement>document.getElementById(`objective-${i}`)).value;
      section.subsections.forEach((subsection, j) => {
        this.newTemplate[i].subsections[j].title = (<HTMLInputElement>document.getElementById(`title-${i}${j}`)).value;
        subsection.questions.forEach((question, k) => {
          this.newTemplate[i].subsections[j].questions[k] = (<HTMLInputElement>document.getElementById(`question-${i}${j}${k}`)).value;
        });
      });
    });
  }

  postResults = () => new Promise((resolve, reject) => {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const body = {
      "template_name": this.name.get('name').value,
      "date_created": date,
      "state": "active",
      "template_object": JSON.stringify(this.newTemplate)
    }

    this.db.postTemplate(body).subscribe(resolve);
  });

  submit() {
    if (this.name.valid && confirm("Are you sure you want to create this template?")) {
      this.setAllValues();
      this.postResults()
        .then(() => this.router.navigate(['main/other']))
        .catch(() => alert("there was a problem posting the request!"))
    }
  }

  cancel() {
    this.router.navigate(['main/other']);
  }
}
