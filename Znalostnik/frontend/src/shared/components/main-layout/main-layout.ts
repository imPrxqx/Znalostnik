import { Component } from '@angular/core';
import { Footer } from '@shared/components/footer/footer';
import { Header } from '@shared/components/header/header';

@Component({
  selector: 'app-main-layout',
  imports: [Footer, Header],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
