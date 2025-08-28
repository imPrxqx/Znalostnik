import { Component, signal } from '@angular/core';
import { Renderer } from '../../../../shared/renderer/components/renderer';
import { environment } from '../../../../environments/environment.development';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-test',
  imports: [Renderer, FormsModule, CommonModule],
  templateUrl: './exercise-test.html',
  styleUrl: './exercise-test.css',
})
export class ExerciseTest {
  answers = { answers: [] };
  exerciseId: string = '';
  document = signal<Record<string, any>>({ exercises: [] });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        (this.answers as any) = { answers: [] };
        const parsed = JSON.parse(reader.result as string);
        this.document.set(parsed);
      } catch (e) {
        console.error('Json Parser error');
      }
    };

    reader.readAsText(file);
  }

  async sendAnswers() {
    console.log('Sending answers:', this.answers);
    console.log('id', this.exerciseId);

    try {
      const answerData = this.answers;
      const stringifiedAnswer = JSON.stringify(answerData);
      console.log('Answer', stringifiedAnswer);
      const response = await fetch(environment.apiURL + '/Exercise/' + this.exerciseId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          exerciseAnswer: stringifiedAnswer,
        }),
      });

      const exercises = await response.json();
      this.document.set(exercises);

      //(this.answers as any) = { answers: [] };
      console.log('FEEEDBACAAAK', this.document(), this.answers);
    } catch (error) {
      console.error(error);
    }
  }

  onAnswerChanged(data: any) {
    console.log(data);
    const existingIndex = (this.answers as any).answers.findIndex(
      (a: any) => a.exerciseId === data.exerciseId && a.blockTemplate === data.blockTemplate,
    );

    if (existingIndex !== -1) {
      (this.answers as any).answers[existingIndex].answer = data.answer;
    } else {
      (this.answers as any).answers.push(data);
    }
  }

  async sendDocument() {
    try {
      console.log('document', JSON.stringify(JSON.stringify(this.document())));
      const documentData = this.document();
      const stringifiedDocument = JSON.stringify(documentData);

      const response = await fetch(environment.apiURL + '/Exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          exerciseDocument: stringifiedDocument,
        }),
      });

      const result = await response.json();
      console.log('id', result);
    } catch (error) {
      console.error(error);
    }
  }

  async onLoadServer() {
    try {
      console.log('load exercise:' + environment.apiURL + '/Exercise/' + this.exerciseId);
      const response = await fetch(environment.apiURL + '/Exercise/' + this.exerciseId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      const exercises = await response.json();
      const parsedContent = JSON.parse(exercises['content']);
      console.log(parsedContent);
      this.document.set(parsedContent);
      this.exerciseId = exercises['id'];
    } catch (error) {
      console.error(error);
    }
  }
}
