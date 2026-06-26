import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Registry } from '@shared/models/registry';

@Component({
  selector: 'app-guide',
  imports: [MatIconModule, MatCardModule, MatExpansionModule],
  templateUrl: './guide.html',
  styleUrl: './guide.scss',
})
export class Guide {
  gameModes = Registry.gameModes;
  activities = Registry.activities;
}
