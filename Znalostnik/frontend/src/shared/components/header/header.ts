import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Authentication } from '@core/services/authentication';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, MatToolbarModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  auth: Authentication = inject(Authentication);
}
