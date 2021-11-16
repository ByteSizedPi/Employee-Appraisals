import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestDbConnectionService {
  constructor() { }

  error(err) {
    setTimeout(() => {
      alert(err.toString());
    }, 1);
    window.location.reload();
    return err;
  }
}
