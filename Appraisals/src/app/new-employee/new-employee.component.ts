import { HttpClient } from '@angular/common/http';
import { DatabaseService } from 'src/app/database.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss']
})
export class NewEmployeeComponent implements OnInit {
  public newEmployee: FormGroup;
  public formIsValid = true;
  public curDepartment = null;
  public curRank = null;
  public departments = [];
  public newDeptIsValid = true;
  public errorString = "Field Empty";
  public userExists = false;
  public ranks;

  constructor(private db: DatabaseService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.db.getAllDepartments()
      .subscribe((departments: []) => {
        this.departments = departments.map(dep => dep['department']);
        this.curDepartment = this.departments[0];
        this.ranks = this.db.getRanks();
        this.curRank = this.ranks[0];
      });

    this.newEmployee = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email, Validators.minLength(6)], this.verifyEmail.bind(this)),
    });
  }

  verifyEmail = (control: FormControl) => new Promise(resolve => {
    this.db.getAllUsers()
      .subscribe((users: []) => {
        this.userExists = users.filter(user => user["username"] === control.value).length > 0;
        resolve(this.userExists ? { msg: "Userfound" } : null);
      })
  });

  setRank(index: number) {
    this.curRank = this.ranks[index];
  }

  setDepartment(index: number) {
    this.curDepartment = this.departments[index];
  }

  validateDept() {
    const newDept = (<HTMLInputElement>document.getElementById("new-dept")).value.trim();

    const empty = newDept.length === 0;
    const exists = this.departments.indexOf(newDept) !== -1;
    const reserved = newDept.toLowerCase() === 'root';

    if (empty) this.errorString = "Field Empty";
    if (exists && !empty) this.errorString = "Already Exists";
    if (reserved) this.errorString = "Reserved";

    this.newDeptIsValid = !empty && !exists && !reserved;
    if (this.newDeptIsValid) this.curDepartment = newDept;

  }

  cancel() {
    this.router.navigate(['/main/other']);
  }

  submitUser() {
    if (this.curRank === 'root' || this.curRank === 'admin') {
      this.curDepartment = 'none';
    }
    if (this.curRank === 'manager') {
      this.validateDept();
    } else {
      this.newDeptIsValid = true;
    }
    if (this.newEmployee.valid && this.newDeptIsValid) {
      if (confirm("Are you sure you want to add this new Employee?")) {
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const data = {
          "username": this.newEmployee.get("email").value,
          "name": this.newEmployee.get("name").value,
          "password": this.newEmployee.get("email").value,
          "department": this.curDepartment,
          "rank": this.curRank,
          "date_created": date,
        }

        const newUser = {
          "Username": data.username,
          "Email": data.username,
          "Password": data.password,
          "ConfirmPassword": data.password
        }

        this.db.registerUser(newUser)
          .subscribe(
            results => {
              this.db.newUser(data)
                .subscribe(res => this.router.navigate(['main/other']));
            },
            err => console.log(err)
          )

      }
    } else {
      alert("please fill in all information");
    }
  }

}
