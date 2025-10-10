import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toolbar">
      <button class="btn primary" (click)="new.emit()">New</button>
      <button class="btn success" (click)="save.emit()">Save</button>
      <button class="btn danger" (click)="delete.emit()">Delete</button>
      <button class="btn secondary" (click)="first.emit()">First</button>
      <button class="btn secondary" (click)="previous.emit()">Previous</button>
      <button class="btn secondary" (click)="next.emit()">Next</button>
      <button class="btn secondary" (click)="last.emit()">Last</button>
      <button class="btn info" (click)="print.emit()">Print</button>
    </div>
  `,
  styles: [
    `
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
      }

      .btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
        color: #fff;
      }

      .btn.primary {
        background-color: #3b82f6; /* blue */
      }
      .btn.primary:hover {
        background-color: #2563eb;
      }

      .btn.success {
        background-color: #10b981; /* green */
      }
      .btn.success:hover {
        background-color: #059669;
      }

      .btn.danger {
        background-color: #ef4444; /* red */
      }
      .btn.danger:hover {
        background-color: #dc2626;
      }

      .btn.secondary {
        background-color: #6b7280; /* gray */
      }
      .btn.secondary:hover {
        background-color: #4b5563;
      }

      .btn.info {
        background-color: #0ea5e9; /* light blue */
      }
      .btn.info:hover {
        background-color: #0284c7;
      }
    `,
  ],
})
export class GridToolbarComponent {
  @Output() new = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() first = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() last = new EventEmitter<void>();
  @Output() print = new EventEmitter<void>();
}
