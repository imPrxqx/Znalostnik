import { Component } from '@angular/core';
import { Authentication } from '../authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css'
})
export class Logout {
  constructor(authService: Authentication, router: Router) {
    this.authService = authService
    this.router = router

  }
  
  router: Router;
  authService: Authentication;
  
  ngOnInit() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
