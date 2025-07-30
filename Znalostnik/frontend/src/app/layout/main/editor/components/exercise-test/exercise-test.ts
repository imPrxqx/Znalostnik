import { Component, signal } from '@angular/core';
import { Renderer } from '../../../renderer/components/renderer';

@Component({
  selector: 'app-exercise-test',
  imports: [Renderer],
  templateUrl: './exercise-test.html',
  styleUrl: './exercise-test.css',
})
export class ExerciseTest {
  answers: any[] = [];
  document = signal<Record<string, any>>({ exercises: [] });
  selectedExercise = signal<any>({});

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        this.answers = [];
        const parsed = JSON.parse(reader.result as string);
        this.document.set(parsed || {});
        this.selectedExercise.set(this.document()['exercises'][0] || []);
      } catch (e) {
        console.error('Json Parser error');
      }
    };

    reader.readAsText(file);
  }

  sendAnswers() {
    console.log('Sending answers:', this.answers);
  }

  onAnswerChanged(data: any) {
    const existingIndex = this.answers.findIndex(
      (a) => a.exerciseId === data.exerciseId && a.blockTemplate === data.blockTemplate,
    );

    if (existingIndex !== -1) {
      this.answers[existingIndex].answer = data.answer;
    } else {
      this.answers.push(data);
    }
  }
}
