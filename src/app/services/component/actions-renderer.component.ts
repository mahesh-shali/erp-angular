import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-actions-renderer',
  standalone: true,
  template: `
    <div class="flex gap-2">
      <button class="btn btn-xs btn-primary" (click)="onSave()">Save</button>
      <button class="btn btn-xs btn-warning" (click)="onModify()">
        Modify
      </button>
      <button class="btn btn-xs btn-danger" (click)="onDelete()">Delete</button>
    </div>
  `,
})
export class ActionsRendererComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onSave() {
    this.params.context.componentParent.saveRow(this.params.node.rowIndex);
  }

  onModify() {
    this.params.context.componentParent.editRow(this.params.node.rowIndex);
  }

  onDelete() {
    this.params.context.componentParent.deleteRow(this.params.node.rowIndex);
  }
}
