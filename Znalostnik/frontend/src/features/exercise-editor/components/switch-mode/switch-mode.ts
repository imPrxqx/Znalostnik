import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { EditorManager } from '@features/exercise-editor/services/editor-manager';
import { ChangeModeComponent } from '@shared/commands/change-mode-command';

@Component({
  selector: 'app-switch-mode',
  imports: [FormsModule],
  templateUrl: './switch-mode.html',
  styleUrl: './switch-mode.scss',
})
export class SwitchMode {
  editorService = inject(EditorManager);
  commandManager = inject(CommandManager);
  modes: string[] = ['homework', 'test', 'interactive', 'exercise'];

  currentMode = computed(() => this.editorService.mode());

  onSelectChange(event: Event) {
    const mode = (event.target as HTMLSelectElement).value;
    const command = new ChangeModeComponent(this.editorService, mode);
    this.commandManager.execute(command);
  }
}
