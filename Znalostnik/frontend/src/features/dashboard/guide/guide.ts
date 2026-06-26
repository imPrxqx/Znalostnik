import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-guide',
  imports: [MatIconModule, MatCardModule, MatExpansionModule],
  templateUrl: './guide.html',
  styleUrl: './guide.scss',
})
export class Guide {}
