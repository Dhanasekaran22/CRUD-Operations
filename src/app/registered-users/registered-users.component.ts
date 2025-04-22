import { Component , OnInit } from '@angular/core';
import { CouchdbService } from '../couchdb.service';

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrl: './registered-users.component.css'
})
export class RegisteredUsersComponent {
  users: any[] = [];
  isEditing = false;
  editUserData: any = {
    _id: '',
    _rev: '',
    username: '',
    email: '',
    password: ''
  };

  constructor(private couch: CouchdbService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.couch.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.rows.map((row: any) => row.doc);
      },
      error: (err) => {
        console.log("Error fetching users:", err.message);
      }
    });
  }

  deleteUser(id: string, rev: string) {
    this.couch.deleteUser(id, rev).subscribe({
      next: () => this.fetchUsers(),
      error: (err) => console.log("Delete error", err)
    });
  }

  startEdit(user: any) {
    this.isEditing = true;
    this.editUserData = { ...user }; // clone user
  }

  updateUser() {
    const updatedUser = {
      ...this.editUserData,
      type: 'register'
    };

    this.couch.updateUser(updatedUser).subscribe({
      next: () => {
        alert("User updated successfully");
        this.fetchUsers();
        this.isEditing = false;
        this.editUserData = { _id: '', _rev: '', username: '', email: '', password: '' };
      },
      error: (err) => console.log("Update error", err)
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editUserData = { _id: '', _rev: '', username: '', email: '', password: '' };
  }
}
