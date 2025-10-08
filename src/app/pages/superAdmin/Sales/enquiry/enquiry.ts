import { Component, OnInit } from '@angular/core';
import {
  ColDef,
  GridOptions,
  CellKeyDownEvent,
  Column,
} from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-enquiry',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AgGridModule],
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
    {
      headerName: 'Actions',
      cellRenderer: 'actionsRenderer',
      editable: false,
    },
  ];

  gridOptions: GridOptions = {};

  constructor() {
    this.gridOptions = {
      stopEditingWhenCellsLoseFocus: true,
      singleClickEdit: false,
      onCellKeyDown: (event: CellKeyDownEvent) =>
        this.onCellKeyDownHandler(event),
    };
  }

  ngOnInit(): void {}

  /** Enter key handler */
  onCellKeyDownHandler(event: CellKeyDownEvent) {
    const keyEvent = event.event as KeyboardEvent;
    if (!keyEvent) return;

    // Get all displayed columns directly from event.api
    const allColumns: Column[] = event.api.getAllDisplayedColumns();
    const lastColumn = allColumns[allColumns.length - 1];

    // If Enter pressed on last column, add new row
    if (
      keyEvent.key === 'Enter' &&
      event.column.getColId() === lastColumn.getColId()
    ) {
      keyEvent.preventDefault();
      this.addNewRow();
    }
  }

  /** Add new empty row */
  addNewRow() {
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
}
