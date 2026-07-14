import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RegistryActivity } from '@shared/registry/registry-activity';
import { RegistrySession } from '@shared/registry/registry-session';

/**
 * Provides a information about application.
 */
@Component({
  selector: 'app-guide',
  imports: [MatIconModule, MatCardModule, MatExpansionModule],
  templateUrl: './guide.html',
  styleUrl: './guide.scss',
})
export class Guide {
  respondTypes = RegistrySession.respondTypes;
  gameModes = RegistrySession.gameModes;
  activities = RegistryActivity.activities;
}
