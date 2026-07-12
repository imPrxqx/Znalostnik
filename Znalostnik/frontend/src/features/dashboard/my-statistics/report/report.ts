import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  effect,
  input,
  OnInit,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { ReportsManager } from './services/reports-manager';
import { ExerciseActivity } from '@features/exercise-editor/components/exercise-activity/exercise-activity';
import { Activity } from '@shared/models/activity';
import { ActivityAnswer } from '@shared/models/activity-answer';
import { RegistryActivity } from '@shared/models/registry-activity';

@Component({
  selector: 'app-report',
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    RouterLink,
    ExerciseActivity,
  ],
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report implements OnInit {
  sessionId = input.required<string>();

  reports = inject(ReportsManager);
  route = inject(ActivatedRoute);
  router = inject(Router);

  expandedActivityId = signal<string | undefined>(undefined);
  selectedParticipantId = signal<string | undefined>(undefined);

  id = computed(() => this.reports.id());
  title = computed(() => this.reports.title());
  respondType = computed(() => this.reports.respondType());
  answers = computed(() => this.reports.answers());
  activities = computed(() => this.reports.activities());
  participants = computed(() => this.reports.participants());

  answerDistributionChartRef = viewChild<ElementRef>('answerDistributionChart');
  answerDistributionChart?: Chart;
  answerStatusChartRef = viewChild<ElementRef>('answerStatusChart');
  answerStatusChart?: Chart;
  activityTypeSuccessChartRef = viewChild<ElementRef>('activityTypeSuccessChart');
  activityTypeSuccessChart?: Chart;
  participantActivitySuccessChartRef = viewChild<ElementRef>('participantActivitySuccessChart');
  participantActivitySuccessChart?: Chart;
  participantFullHistoryChartRef = viewChild<ElementRef>('participantFullHistoryChart');
  participantFullHistoryChart?: Chart;
  participantActivityHistoryChartRef = viewChild<ElementRef>('participantActivityHistoryChart');
  participantActivityHistoryChart?: Chart;

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.reports.loadReport(sessionId);
  }

  constructor() {
    this.selectedParticipantId.set(undefined);
    this.expandedActivityId.set(undefined);

    effect(() => {
      this.id();
      this.renderAnswerDistributionChart();
      this.renderAnswerStatusChart();
      this.renderActivityTypeSuccessChart();
    });
  }

  renderAnswerDistributionChart() {
    this.answerDistributionChart?.destroy();

    if (!this.answerDistributionChartRef()?.nativeElement) {
      return;
    }

    const percentageRangeList = [0, 0, 0, 0, 0];

    this.answers().forEach((a) => {
      const percent = a.correctPercentage;

      if (percent === 0) {
        percentageRangeList[0]++;
      } else if (percent <= 25) {
        percentageRangeList[1]++;
      } else if (percent <= 50) {
        percentageRangeList[2]++;
      } else if (percent <= 75) {
        percentageRangeList[3]++;
      } else {
        percentageRangeList[4]++;
      }
    });

    this.answerDistributionChart = new Chart(this.answerDistributionChartRef()!.nativeElement, {
      type: 'bar',
      data: {
        labels: ['0%', '1-25%', '26-50%', '51-75%', '79-100%'],
        datasets: [
          {
            label: $localize`:@@report.distribution:Rozložení úspěšnosti odpovědí`,
            data: percentageRangeList,
            backgroundColor: '#77e97b',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            title: {
              display: true,
              text: $localize`:@@report.count:Počet odpovědí`,
            },
          },
          x: {
            title: {
              display: true,
              text: $localize`:@@report.activityType:Rozložení správnosti odpovědi v %`,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  renderAnswerStatusChart() {
    this.answerStatusChart?.destroy();

    if (!this.answerStatusChartRef()?.nativeElement) {
      return;
    }

    const correct = this.answers().filter((a) => a.correctPercentage === 100);
    const partial = this.answers().filter(
      (a) => a.correctPercentage > 0 && a.correctPercentage < 100,
    );
    const wrong = this.answers().filter((a) => a.correctPercentage === 0);

    this.answerStatusChart = new Chart(this.answerStatusChartRef()!.nativeElement, {
      type: 'pie',
      data: {
        labels: [
          $localize`:@@report.correct:Správně`,
          $localize`:@@report.partial:Částečně`,
          $localize`:@@report.wrong:Špatně`,
        ],
        datasets: [
          {
            data: [correct.length, partial.length, wrong.length],
            backgroundColor: ['#77e97b', '#e4b56e', '#f4857d'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  renderActivityTypeSuccessChart() {
    this.activityTypeSuccessChart?.destroy();

    if (!this.activityTypeSuccessChartRef()?.nativeElement) {
      return;
    }

    const grouped = new Map<string, number[]>();

    this.activities().forEach((act) => {
      const answers = this.answers().filter((a) => a.activityId === act.id());

      if (answers.length === 0) {
        return;
      }

      const type = RegistryActivity.getActivity(act.type()).name;
      const success = answers.map((a) => a.correctPercentage);

      let exists = grouped.get(type);

      if (exists === undefined) {
        exists = [];
      }

      exists.push(...success);
      grouped.set(type, exists);
    });

    const list = [...grouped].map(([type, success]) => ({
      type,
      value: Math.round(success.reduce((sum, correct) => sum + correct, 0) / success.length),
    }));

    this.activityTypeSuccessChart = new Chart(this.activityTypeSuccessChartRef()!.nativeElement, {
      type: 'bar',
      data: {
        labels: list.map((item) => item.type),
        datasets: [
          {
            data: list.map((item) => item.value),
            backgroundColor: '#77e97b',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            title: {
              display: true,
              text: $localize`:@@report.correctPercent:Správnost v %`,
            },
            min: 0,
            max: 100,
          },
          x: {
            title: {
              display: true,
              text: $localize`:@@report.activityType:Typ aktivity`,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  renderParticipantActivitySuccessChart() {
    this.participantActivitySuccessChart?.destroy();

    if (!this.participantActivitySuccessChartRef()?.nativeElement) {
      return;
    }

    const data: { label: string; value: number }[] = [];

    this.activities().forEach((act: Activity, index: number) => {
      const answers = this.answers().filter(
        (a) => a.activityId === act.id() && a.submissionId === this.selectedParticipantId(),
      );

      if (answers.length === 0) {
        return;
      }

      const average = answers.reduce((sum, a) => sum + a.correctPercentage, 0) / answers.length;

      data.push({
        label: `A${index + 1}`,
        value: Math.round(average),
      });
    });

    this.participantActivitySuccessChart = new Chart(
      this.participantActivitySuccessChartRef()!.nativeElement,
      {
        type: 'bar',
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => d.value),
              backgroundColor: '#77e97b',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              title: {
                display: true,
                text: $localize`:@@report.correctPercent:Správnost v %`,
              },
              min: 0,
              max: 100,
            },
            x: {
              title: {
                display: true,
                text: $localize`:@@report.attemptActivity:Aktivita`,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      },
    );
  }

  renderParticipantFullHistoryChart() {
    this.participantFullHistoryChart?.destroy();

    if (!this.participantFullHistoryChartRef()?.nativeElement) {
      return;
    }

    const data = this.answers()
      .filter((a) => a.submissionId === this.selectedParticipantId())
      .map((a, i: number) => ({
        attempt: i + 1,
        correct: a.correctPercentage,
      }));

    data.unshift({
      attempt: 0,
      correct: 0,
    });

    this.participantFullHistoryChart = new Chart(
      this.participantFullHistoryChartRef()!.nativeElement,
      {
        type: 'line',
        data: {
          labels: data.map((d) => `${$localize`:@@report.attempt:Pokus`} ${d.attempt}`),
          datasets: [
            {
              data: data.map((d) => d.correct),
              borderColor: '#56a1df',
              pointBackgroundColor: '#56a1df',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              title: {
                display: true,
                text: $localize`:@@report.correctPercent:Správnost v %`,
              },
              min: 0,
              max: 100,
            },
            x: {
              title: {
                display: true,
                text: $localize`:@@report.attemptHistory:Vývoj úspěšnosti pokusů`,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      },
    );
  }

  renderParticipantActivityHistoryChart() {
    this.participantActivityHistoryChart?.destroy();

    if (!this.participantActivityHistoryChartRef()?.nativeElement) {
      return;
    }

    const data = this.answers()
      .filter(
        (a) =>
          a.submissionId === this.selectedParticipantId() &&
          a.activityId === this.expandedActivityId()!,
      )
      .map((a: ActivityAnswer, i: number) => ({
        attempt: i + 1,
        correct: a.correctPercentage,
      }));

    data.unshift({
      attempt: 0,
      correct: 0,
    });

    this.participantActivityHistoryChart = new Chart(
      this.participantActivityHistoryChartRef()!.nativeElement,
      {
        type: 'line',
        data: {
          labels: data.map((d) => `${$localize`:@@report.attempt:Pokus`} ${d.attempt}`),
          datasets: [
            {
              data: data.map((d) => d.correct),
              borderColor: '#56a1df',
              pointBackgroundColor: '#56a1df',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              title: {
                display: true,
                text: $localize`:@@report.correctPercent:Správnost v %`,
              },
              min: 0,
              max: 100,
            },
            x: {
              title: {
                display: true,
                text: $localize`:@@report.attemptHistory:Vývoj úspěšnosti pokusů`,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      },
    );
  }

  selectActivity(activityId: string) {
    this.expandedActivityId.update((c) => (c === activityId ? undefined : activityId));

    setTimeout(() => {
      this.renderParticipantActivityHistoryChart();
    });
  }

  selectParticipant(participantId: string) {
    this.expandedActivityId.set(undefined);
    this.selectedParticipantId.set(participantId);

    setTimeout(() => {
      this.renderParticipantFullHistoryChart();
      this.renderParticipantActivitySuccessChart();
    });
  }

  getActivity(activityId: string) {
    const activity = this.activities().find((a) => a.id() === activityId)!;
    return activity;
  }

  getActivityDefinition(activityId: string) {
    const activity = this.getActivity(activityId);
    return RegistryActivity.getActivity(activity.type());
  }

  getCountCorrectAnswers(activityId: string) {
    let answers = this.answers().filter(
      (a) => a.activityId === activityId && a.correctPercentage === 100,
    );

    if (this.selectedParticipantId()) {
      answers = answers.filter((a) => a.submissionId === this.selectedParticipantId());
    }

    return answers.length;
  }

  getCountPartialAnswers(activityId: string) {
    let answers = this.answers().filter(
      (a) => a.activityId === activityId && a.correctPercentage > 0 && a.correctPercentage < 100,
    );

    if (this.selectedParticipantId()) {
      answers = answers.filter((a) => a.submissionId === this.selectedParticipantId());
    }

    return answers.length;
  }

  getCountWrongAnswers(activityId: string) {
    let answers = this.answers().filter(
      (a) => a.activityId === activityId && a.correctPercentage == 0,
    );

    if (this.selectedParticipantId()) {
      answers = answers.filter((a) => a.submissionId === this.selectedParticipantId());
    }

    return answers.length;
  }

  getAccuracyCorrectAnswers(activityId: string) {
    let answers = this.answers().filter((a) => a.activityId === activityId);

    if (this.selectedParticipantId()) {
      answers = answers.filter((a) => a.submissionId === this.selectedParticipantId());
    }

    if (answers.length === 0) {
      return 0;
    }

    let accuracy = 0;

    for (const answer of answers) {
      accuracy += answer.correctPercentage;
    }

    return Math.ceil(accuracy / answers.length);
  }
}
