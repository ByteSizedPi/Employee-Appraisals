import { TestDbConnectionService } from './../test-db-connection.service';
import { DatabaseService } from './../database.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public error;
  public loggingIn = false;

  constructor(private router: Router, private db: DatabaseService, private dbErr: TestDbConnectionService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, Validators.required, this.verifyUsername.bind(this)),
      'password': new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;

    if (!(this.error = this.loginForm.valid ? undefined : "details not valid")) {
      this.loggingIn = true;
      this.db.loginUser(username, password)
        .then(() => {
          this.loggingIn = false;
          this.router.navigate([`main/${this.getDestination()}`])
        })
        .catch(err => {
          this.loggingIn = false;
          this.error = err
        });
    }
  }

  getDestination() {
    const rank = this.db.getCurUser()["rank"];
    if (rank === "manager") return "employee";
    if (rank === "employee") return "self";
    return "other";
  }

  verifyUsername = (control: FormControl) => new Promise(resolve => {
    this.db.testUsername(control.value)
      .then(user => {
        if (user) this.error = undefined;
        resolve(user ? null : { msg: "UserNotFound" });
      })
      .catch(err => this.dbErr.error(err));
  });
}
