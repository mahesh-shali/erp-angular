import { Component, OnInit } from '@angular/core';
import {
  ColDef,
  GridOptions,
  CellKeyDownEvent,
  Column,
  RowNode,
  GridApi,
  // ColumnApi,
} from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { GridToolbarComponent } from 'src/app/services/component/GridToolbarComponent';

@Component({
  selector: 'app-enquiry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    GridToolbarComponent,
  ],
  templateUrl: './enquiry.html',
  styleUrls: ['./enquiry.scss'],
})
export class Enquiry implements OnInit {
  roleId: number | null = 1;
  isLoadingEnquiry = false;
  enquires: any[] = [];

  rowData = [
    { id: 1, name: 'Item 1', price: 100 },
    { id: 2, name: 'Item 2', price: 150 },
  ];

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', editable: false },
    { field: 'name', headerName: 'Name', editable: true },
    { field: 'price', headerName: 'Price', editable: true },
  ];

  gridOptions: GridOptions = {};
  gridApi!: GridApi;
  // gridColumnApi!: ColumnApi;

  constructor() {
    this.gridOptions = {
      stopEditingWhenCellsLoseFocus: true,
      singleClickEdit: false,
      onCellKeyDown: (event: CellKeyDownEvent) =>
        this.onCellKeyDownHandler(event),
    };
  }

  ngOnInit(): void {}

  onGridReady(params: any) {
    this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
  }

  /** Handle Enter: move to next cell, or add a new row if on last column */
  // onCellKeyDownHandler(event: CellKeyDownEvent) {
  //   const keyEvent = event.event as KeyboardEvent;
  //   const api = event.api;
  //   const currentRowIndex = event.node?.rowIndex ?? 0;
  //   const allColumns: Column[] = api.getAllDisplayedColumns();

  //   // 🔹 Handle Enter key
  //   if (keyEvent.key === 'Enter') {
  //     keyEvent.preventDefault();

  //     const currentColumn = event.column;
  //     const currentColIndex = allColumns.findIndex(
  //       (col) => col.getColId() === currentColumn.getColId()
  //     );
  //     const nextCol = allColumns[currentColIndex + 1];

  //     if (nextCol) {
  //       api.stopEditing();
  //       api.startEditingCell({
  //         rowIndex: Number(currentRowIndex),
  //         colKey: nextCol.getColId(),
  //       });
  //     } else {
  //       this.addNewRow();
  //       setTimeout(() => {
  //         const newRowIndex = Number(this.rowData.length - 1);
  //         const firstEditableCol = allColumns.find(
  //           (col) => col.getColDef()?.editable
  //         );
  //         if (firstEditableCol) {
  //           api.startEditingCell({
  //             rowIndex: newRowIndex,
  //             colKey: firstEditableCol.getColId(),
  //           });
  //         }
  //       }, 0);
  //     }
  //     return;
  //   }

  //   // 🔹 Handle Delete key (remove current row)
  //   if (keyEvent.key === 'Delete') {
  //     keyEvent.preventDefault();

  //     if (this.rowData.length === 0) return;

  //     // Remove current row by index
  //     this.rowData.splice(currentRowIndex, 1);
  //     this.rowData = [...this.rowData]; // trigger UI refresh

  //     // Optional: adjust focus
  //     setTimeout(() => {
  //       const newFocusIndex =
  //         currentRowIndex >= this.rowData.length
  //           ? this.rowData.length - 1
  //           : currentRowIndex;

  //       if (newFocusIndex >= 0 && this.rowData[newFocusIndex]) {
  //         const firstEditableCol = allColumns.find(
  //           (col) => col.getColDef()?.editable
  //         );
  //         if (firstEditableCol) {
  //           api.startEditingCell({
  //             rowIndex: newFocusIndex,
  //             colKey: firstEditableCol.getColId(),
  //           });
  //         }
  //       }
  //     }, 0);
  //   }

  // }

  onCellKeyDownHandler(event: CellKeyDownEvent) {
    const keyEvent = event.event as KeyboardEvent;
    const api = event.api;
    const currentRowIndex = event.node?.rowIndex ?? 0;
    const allColumns: Column[] = api.getAllDisplayedColumns();

    // ✅ ENTER → Move to next cell or add new row
    if (keyEvent.key === 'Enter') {
      keyEvent.preventDefault();

      const currentColumn = event.column;
      const currentColIndex = allColumns.findIndex(
        (col) => col.getColId() === currentColumn.getColId()
      );
      const nextCol = allColumns[currentColIndex + 1];

      if (nextCol) {
        api.stopEditing();
        api.startEditingCell({
          rowIndex: Number(currentRowIndex),
          colKey: nextCol.getColId(),
        });
      } else {
        this.addNewRow();
        setTimeout(() => {
          const newRowIndex = this.rowData.length - 1;
          const firstEditableCol = allColumns.find(
            (col) => col.getColDef()?.editable
          );
          if (firstEditableCol) {
            api.startEditingCell({
              rowIndex: newRowIndex,
              colKey: firstEditableCol.getColId(),
            });
          }
        }, 0);
      }
      return;
    }

    // ✅ DELETE → Remove current row
    if (keyEvent.key === 'Delete') {
      keyEvent.preventDefault();

      if (this.rowData.length === 0) return;

      this.rowData.splice(currentRowIndex, 1);
      this.rowData = [...this.rowData];

      // Move focus to a valid cell after deletion
      setTimeout(() => {
        const newFocusIndex =
          currentRowIndex >= this.rowData.length
            ? this.rowData.length - 1
            : currentRowIndex;

        if (newFocusIndex >= 0 && this.rowData[newFocusIndex]) {
          const firstEditableCol = allColumns.find(
            (col) => col.getColDef()?.editable
          );
          if (firstEditableCol) {
            api.startEditingCell({
              rowIndex: newFocusIndex,
              colKey: firstEditableCol.getColId(),
            });
          }
        }
      }, 0);
      return;
    }

    // ✅ ESC → Delete the *last row* only if it's empty
    if (keyEvent.key === 'Escape') {
      const lastRow = this.rowData[this.rowData.length - 1];

      if (!lastRow) return;

      const isEmpty =
        (!lastRow.name || lastRow.name.trim() === '') &&
        (!lastRow.price || lastRow.price === 0);

      if (isEmpty) {
        keyEvent.preventDefault();
        this.rowData.pop(); // remove last row
        this.rowData = [...this.rowData];

        // Optional: focus previous row after deletion
        setTimeout(() => {
          const prevRowIndex = this.rowData.length - 1;
          if (prevRowIndex >= 0) {
            const firstEditableCol = allColumns.find(
              (col) => col.getColDef()?.editable
            );
            if (firstEditableCol) {
              api.startEditingCell({
                rowIndex: prevRowIndex,
                colKey: firstEditableCol.getColId(),
              });
            }
          }
        }, 0);
      }
    }
  }

  /** 🔹 Add new row only if the previous row has valid data */
  addNewRow() {
    const lastRow = this.rowData[this.rowData.length - 1];
    if (!lastRow.name || !lastRow.price) {
      console.warn('Fill the last row before adding a new one.');
      return;
    }

    const newRow = { id: this.rowData.length + 1, name: '', price: 0 };
    this.rowData = [...this.rowData, newRow];
  }

  saveRow(index: number) {
    console.log('Save row:', this.rowData[index]);
  }

  editRow(index: number) {
    console.log('Modify row:', this.rowData[index]);
  }

  deleteRow(index: number) {
    this.rowData.splice(index, 1);
    this.rowData = [...this.rowData];
  }

  saveAll() {
    console.log('Save all data:', this.rowData);
  }

  deleteSelected() {
    // Optional: delete selected row(s) if using row selection
  }

  goToFirst() {
    this.gridApi?.ensureIndexVisible(0, 'top');
  }

  goToPrevious() {
    const firstIndex = this.gridApi?.getFirstDisplayedRowIndex() ?? 0;
    this.gridApi?.ensureIndexVisible(Math.max(firstIndex - 1, 0));
  }

  goToNext() {
    const lastIndex = this.gridApi?.getLastDisplayedRowIndex() ?? 0;
    const firstIndex = this.gridApi?.getFirstDisplayedRowIndex() ?? 0;
    this.gridApi?.ensureIndexVisible(Math.min(firstIndex + 1, lastIndex));
  }

  goToLast() {
    const lastIndex = this.rowData.length - 1;
    this.gridApi?.ensureIndexVisible(lastIndex, 'bottom');
  }

  printGrid() {
    // this.gridApi?.print();
  }
}
