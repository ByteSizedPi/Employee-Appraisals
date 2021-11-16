import { TestDbConnectionService } from './test-db-connection.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public url = "https://appraisalsapiwebservice.azurewebsites.net/api/";
  public auth;
  private curUser = null;
  private curEmployee = null;
  private curManager = null;
  private curAppraisal = null;
  private token: string = null;
  private ranks = [
    'root',
    'admin',
    'manager',
    'employee',
  ]

  constructor(private testdb: TestDbConnectionService, private http: HttpClient) {
  }

  //User related methods

  getAllUsers = () =>  this.http.get(this.url + "users", { headers: this.auth });

  getAllEmployees = () => new Promise((resolve, reject) => {
    this.getAllUsers().subscribe((data: []) => {
      let res = data.filter(user => user["username"] !== this.curUser["username"]);

      if (this.suffRank(0)) {
        resolve(res);
      } else if (this.suffRank(1)) {
        resolve(res.filter(user => user["rank"] !== "root"));
      } else {
        resolve(res.filter(user => user["department"] === this.curUser["department"] && user["rank"] === "employee"));
      }
    });
  });

  getManagerByDepartment = (department: string) => {
    let params = new HttpParams().set('department', department)
    return this.http.get(this.url + "manager", { params: params, headers: this.auth })
  }

  getAllDepartments = () => this.http.get(this.url + 'departments', { headers: this.auth });

  testUsername = (username: string) => new Promise((resolve, reject) => {
    this.http.get(this.url + "username", { params: { 'username': username } })
      .subscribe((data: []) => resolve(data.length > 0), err => reject(this.testdb.error(err)));
  });

  testPassword = (username: string, password: string) => new Promise((resolve, reject) => {
    this.http.get(this.url + "login", { params: { 'username': username, 'password': password } })
      .subscribe(data => resolve(data[0]), err => reject(this.testdb.error(err)));
  });

  newUser = (body) => this.http.post(this.url + 'newuser', body, { headers: this.auth });

  registerUser = (body) => this.http.post(this.url + "Account/Register", body, { headers: this.auth });

  removeUser = (username) => {
    const params = new HttpParams()
      .set("username", username)
      .set("disableUser", "true");

    return this.http.put(this.url + "removeuser", {}, { params: params, headers: this.auth })
  };

  updatePassword = (password: string) => {
    const params = new HttpParams()
      .set('username', this.curUser["username"])
      .set('password', password);

    return this.http.put(this.url + "updatepassword", {}, { params: params, headers: this.auth })
  };

  //db mutator methods

  loginUser = (username: string, password: string) => new Promise((resolve, reject) => {
    this.testPassword(username, password)
      .then((user: string) => {
        if (user) {
          this.getToken(username, password)
            .subscribe(data => {
              this.token = data["access_token"];
              this.curUser = user;
              this.auth = { 'Authorization': 'Bearer ' + this.token }
              resolve("User Found")
            }, reject);
        } else reject("Password Incorrect");
      })
      .catch(reject)
  });

  getToken = (username: string, password: string) => {
    const body = `grant_type=password&username=${username}&password=${password}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post("https://appraisalsapiwebservice.azurewebsites.net/token", body, { headers: headers });
  }

  logout = () => {
    this.curUser = null;
    this.curEmployee = null;
    this.curAppraisal = null;
    this.curManager = null;
    this.token = null;
    this.auth = null;
  }

  getCurUser = () => this.curUser;

  suffRank = (minreq: number) => minreq >= this.ranks.indexOf(this.curUser["rank"]);

  getRanks = () => this.ranks.slice(this.ranks.indexOf(this.curUser["rank"]), 4);

  getCurEmployee = () => this.curEmployee;

  getCurManager = () => this.curManager;

  getCurAppraisal = () => this.curAppraisal;


  setCurEmployee = (employee) => this.curEmployee = employee;

  setCurManager = (manager) => this.curManager = manager;

  setCurAppraisal = (appraisal) => this.curAppraisal = appraisal;


  // Appraisal related methods

  getAppraisalsByEmployee = (username: string) => {
    let params = new HttpParams().set('username', username);
    return this.http.get(this.url + "appraisals/employee", { params: params, headers: this.auth })
  }

  getAppraisalsByManagerWithName = (username: string) => {
    let params = new HttpParams().set('username', username)
    return this.http.get(this.url + "appraisals/manager", { params: params, headers: this.auth })
  }

  postAppraisal = (body) => this.http.post(this.url + 'Appraisal', body, { headers: this.auth });

  completeAppraisal = (body) => this.http.put(this.url + 'appraisals/complete', {}, { params: body, headers: this.auth });

  cancelAppraisal = (body) => this.http.put(this.url + 'appraisals/cancel', {}, { params: body, headers: this.auth });

  //templates

  getAllTemplates = () => this.http.get(this.url + "Template", { headers: this.auth });

  getTemplateByID = (id: string) => this.http.get(this.url + "Template", { params: { 'id': id }, headers: this.auth });

  postTemplate = (body) => this.http.post(this.url + "Template", body, { headers: this.auth });

}
