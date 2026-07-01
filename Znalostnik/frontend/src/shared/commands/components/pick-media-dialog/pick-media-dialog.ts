import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MediaApi } from '../services/media-api';
import { MatTabsModule } from '@angular/material/tabs';
import { environment } from '@environments/environment';
import { Media } from '@shared/models/format';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pick-media-dialog',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
    MatTabsModule,
  ],
  templateUrl: './pick-media-dialog.html',
  styleUrl: './pick-media-dialog.scss',
})
export class PickMediaDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PickMediaDialog>);
  selectedMedia = signal<Media | undefined>(undefined);
  api = inject(MediaApi);
  snackBar = inject(MatSnackBar);
  media = signal<Media[]>([]);
  images = computed(() => this.media().filter((m) => m.contentType.startsWith('image/')));
  videos = computed(() => this.media().filter((m) => m.contentType.startsWith('video/')));

  ngOnInit() {
    this.loadMedia();
  }

  loadMedia() {
    this.api.getUserMedia().subscribe((result) => {
      this.media.set(result as Media[]);
    });
  }

  onFileSelected(event: Event, type: string) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    this.api.uploadMedia(formData).subscribe({
      next: () => {
        this.snackBar.open(
          $localize`:@@media.created:Média bylo vytvořeno`,
          $localize`:@@close:Zavřít`,
          { duration: 3000 },
        );
        this.loadMedia();
        input.value = '';
      },
    });
  }

  deleteMedia(mediaId: string) {
    this.api.deleteMedia(mediaId).subscribe({
      next: () => {
        this.snackBar.open(
          $localize`:@@media.deleted:Média bylo odstraněno`,
          $localize`:@@close:Zavřít`,
          { duration: 3000 },
        );
        this.media.set(this.media().filter((m) => m.id !== mediaId));
        this.selectedMedia.set(undefined);
      },
    });
  }

  getMediaUrl(mediaId: string): string {
    return `${environment.apiURL}/media/${mediaId}`;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
