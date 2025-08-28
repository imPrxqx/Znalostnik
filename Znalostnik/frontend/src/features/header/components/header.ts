import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Authentication } from '@features/authentication/services/authentication';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService: Authentication = inject(Authentication);
}
