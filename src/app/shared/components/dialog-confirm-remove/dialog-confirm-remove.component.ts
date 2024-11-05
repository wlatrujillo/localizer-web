import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-remove',
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
