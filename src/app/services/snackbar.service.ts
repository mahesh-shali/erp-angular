import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar) {}

  show(
    message: string,
    action: string = 'Close',
    config: MatSnackBarConfig = {}
  ) {
    this.snackBar.open(message, action, { ...this.defaultConfig, ...config });
  }

  showSuccess(message: string) {
    this.show(message, 'Close', { panelClass: ['snackbar-success'] });
  }

  showError(message: string) {
    this.show(message, 'Close', { panelClass: ['snackbar-error'] });
  }
}
