import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-remove',
  standalone: true,
  imports: [ CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './dialog-confirm-remove.component.html',
  styleUrls: ['./dialog-confirm-remove.component.scss']
})
export class DialogConfirmRemoveComponent implements OnInit {

  textValidation: string = 'Borrar';

  text: FormControl = new FormControl();

  constructor(
    private dialogRef: MatDialogRef<DialogConfirmRemoveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onDelete() {
    this.dialogRef.close(true);
  }

}
