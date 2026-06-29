import { CommonModule } from '@angular/common';
import { Component, input, signal, OnInit, OnDestroy } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-timer',
  imports: [CommonModule],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
})
export class Timer implements OnInit, OnDestroy {
  targetTime = input.required<Date>();
  remainingTime = signal<number>(0);

  private scheduler = interval(1000).subscribe(() => {
    const seconds = this.calculateSeconds();
    this.remainingTime.set(seconds);
  });

  ngOnInit(): void {
    const seconds = this.calculateSeconds();
    this.remainingTime.set(seconds);
  }

  ngOnDestroy(): void {
    this.scheduler.unsubscribe();
  }

  calculateSeconds(): number {
    const now = new Date().getTime();
    const target = new Date(this.targetTime()).getTime();
    return Math.max(Math.floor((target - now) / 1000), 0);
  }
}
