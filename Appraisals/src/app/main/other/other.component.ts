import { TestDbConnectionService } from './../../test-db-connection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/database.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {
  // public userLevel = 0;
  public user;
  public manager;
  public canChangePW = false;
  public dataFetched = false;

  public changePWForm: FormGroup;
  public formIsValid: boolean = true;
  public pwIsCorrect: boolean = true;
  public passwordsMatch: boolean = true;
  public allEmployees;
  public allTemplates;

  constructor(public db: DatabaseService, private dbErr: TestDbConnectionService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.db.getCurUser();
    this.db.getManagerByDepartment(this.user["department"])
      .subscribe(manager => {
        this.manager = manager[0];
        this.db.getAllEmployees()
          .then(res => {
            this.allEmployees = res;
            this.dataFetched = true;
            this.db.getAllTemplates()
              .subscribe(templates => this.allTemplates = templates, err => this.dbErr.error(err));
          })
      }, err => this.dbErr.error(err));

    this.changePWForm = new FormGroup({
      'current-password': new FormControl(null, Validators.required, this.verifyPassword.bind(this)),
      'new-password': new FormControl(null, Validators.required),
      'confirm-password': new FormControl(null, Validators.required),
    });
  }

  togglePWComponent() {
    this.canChangePW = !this.canChangePW;
    this.changePWForm.reset();
  }

  onSubmit() {
    this.formIsValid = this.changePWForm.valid;
    this.passwordsMatch = this.matchPasswords();

    const valid = this.confirmPassword() && this.matchPasswords() && this.correctSpec();

    if (this.formIsValid && valid) {
      this.db.updatePassword(this.changePWForm.get('new-password').value)
        .subscribe(res => {
          alert("You have changed your password please log in again");
          this.db.logout();
          this.router.navigate(['/login']);
          this.togglePWComponent();
        }, err => this.dbErr.error(err));
      this.dataFetched = false;
    }
  }

  matchPasswords() {
    this.formIsValid = this.changePWForm.valid;
    return this.changePWForm.get('new-password').value === this.changePWForm.get('confirm-password').value;
  }

  correctSpec() {
    this.formIsValid = this.changePWForm.valid;
    return (this.changePWForm.get('new-password').value || '').length > 6;
  }

  confirmPassword() {
    this.formIsValid = this.changePWForm.valid;
    return this.pwIsCorrect = (this.db.getCurUser()["password"] === this.changePWForm.get('current-password').value);
  }

  verifyPassword = (control: FormControl) => new Promise(resolve => {
    this.pwIsCorrect = control.value.length > 0;
    resolve((this.formIsValid = (control.value.length > 0)) ? null : { msg: "UserNotFound" });
  });

  getAllTemplates() {
    return this.db.getAllTemplates
  }

  date(date: string) {
    return date.replace(/\-|:+/g, '/').split('T')[0];
  }

  removeUser(user) {
    if (confirm("Are you sure you want to remove User:" + user.name + " ( " + user.username + " )?")) {
      this.db.removeUser(user.username)
        .subscribe(() =>
          this.router.navigateByUrl('/main', { skipLocationChange: true })
            .then(() => this.router.navigate(['/main/other']))
            .catch(err => this.dbErr.error(err)),
          err => this.dbErr.error(err)
        )
    }
  }
}
