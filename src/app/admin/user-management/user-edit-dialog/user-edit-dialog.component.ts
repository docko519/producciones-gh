// // import { Component, Inject } from '@angular/core';
// // import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// // import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// // @Component({
// //   selector: 'app-user-edit-dialog',
// //   templateUrl: './user-edit-dialog.component.html',
// //   styleUrls: ['./user-edit-dialog.component.css']
// // })
// // export class UserEditDialogComponent {
// //   userForm: FormGroup;
// //   isNewUser: boolean;

// //   constructor(
// //     private fb: FormBuilder,
// //     public dialogRef: MatDialogRef<UserEditDialogComponent>,
// //     @Inject(MAT_DIALOG_DATA) public data: any
// //   ) {
// //     this.isNewUser = !data.id;
// //     this.userForm = this.fb.group({
// //       nombre: [data.nombre || '', Validators.required],
// //       email: [data.email || '', [Validators.required, Validators.email]],
// //       telefono: [data.telefono || '', Validators.required],
// //       password: ['', this.isNewUser ? [Validators.required, Validators.minLength(6)] : []]
// //     });
// //   }

// //   onSave(): void {
// //     if (this.userForm.valid) {
// //       this.dialogRef.close(this.userForm.value);
// //     }
// //   }

// //   onCancel(): void {
// //     this.dialogRef.close();
// //   }
// // }

// import { Component, Inject } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// @Component({
//   selector: 'app-user-edit-dialog',
//   templateUrl: './user-edit-dialog.component.html',
//   styleUrls: ['./user-edit-dialog.component.css']
// })
// export class UserEditDialogComponent {
//   userForm: FormGroup;
//   isNewUser: boolean;

//   constructor(
//     private fb: FormBuilder,
//     public dialogRef: MatDialogRef<UserEditDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) {
//     this.isNewUser = !data.id;
//     this.userForm = this.fb.group({
//       nombre: [data.nombre || '', Validators.required],
//       email: [data.email || '', [Validators.required, Validators.email]],
//       telefono: [data.telefono || '', Validators.required],
//       password: ['', this.isNewUser ? [Validators.required, Validators.minLength(6)] : []]
//     });
//   }

//   onSave(): void {
//     if (this.userForm.valid) {
//       const result = { ...this.userForm.value };
//       if (!this.isNewUser) {
//         delete result.password; // No actualizamos password en edición
//       }
//       this.dialogRef.close(result);
//     }
//   }

//   onCancel(): void {
//     this.dialogRef.close();
//   }
// }
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.css']
})
export class UserEditDialogComponent {
  userForm: FormGroup;
  isNewUser: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isNewUser = !data.id;
    this.userForm = this.fb.group({
      nombre: [data.nombre || '', Validators.required],
      email: [data.email || '', [Validators.required, Validators.email]],
      telefono: [data.telefono || '', Validators.required],
      password: ['', this.isNewUser ? [Validators.required, Validators.minLength(6)] : []]
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      const result = { ...this.userForm.value };
      if (!this.isNewUser) {
        delete result.password;
      }
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}