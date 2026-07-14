import { Component } from '@angular/core';
import { Join } from '@features/session/join/join';

/**
 * Provides a home application.
 */
@Component({
  selector: 'app-home',
  imports: [Join],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
