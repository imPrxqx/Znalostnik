import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Authentication } from '../../main/authentication/services/authentication';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService: Authentication;

  constructor(authService: Authentication) {
    this.authService = authService;
  }
}
