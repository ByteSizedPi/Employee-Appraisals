import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  constructor(private db: DatabaseService, private router: Router) { }

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> | boolean {
    if (!this.db.getCurUser()) this.router.navigate(['/login'])
    return true;
  };
}
