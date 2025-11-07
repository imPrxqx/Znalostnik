import { Injectable, signal } from '@angular/core';
import { Response } from '@shared/models/format';

@Injectable({
  providedIn: 'root',
})
export class ResponseManager {
  responses = signal<Response[]>([]);

  addResponse(response: Response): void {
    const responses = [...this.responses()];
    responses.push(response);
    this.responses.set(responses);
  }

  changeResponse(id: string, response: Response): void {}
}
