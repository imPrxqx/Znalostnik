import { Component, inject } from '@angular/core';
import { Authentication } from '@core/services/authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
})
export class Logout {
  router: Router = inject(Router);
  authService: Authentication = inject(Authentication);

  ngOnInit() {
    this.authService.logout().subscribe();
    this.router.navigateByUrl('/');
  }
}
