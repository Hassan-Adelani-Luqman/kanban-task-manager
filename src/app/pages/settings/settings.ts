import { Component, inject } from '@angular/core';
import { BoardService } from '../../core/services/board.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
})
export class Settings {
  protected readonly themeService = inject(ThemeService);
  protected readonly boardService = inject(BoardService);

  resetData(): void {
    if (confirm('Reset all boards to demo data? This cannot be undone.')) {
      this.boardService.resetToSeedData();
    }
  }
}
