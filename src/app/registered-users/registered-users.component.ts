import { Component, OnInit } from '@angular/core';
import { CouchdbService } from '../couchdb.service';
import { AngularGridInstance, Column, GridOption, FieldType } from 'angular-slickgrid';

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.css']
})
export class RegisteredUsersComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  gridOptions!: GridOption;
  columnDefinitions: Column[] = [];
  dataset: any[] = [];
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
    this.prepareGrid();
    this.fetchUsers();
  }

  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'username',
        name: 'Username',
        field: 'username',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
      },
      {
        id: 'email',
        name: 'Email',
        field: 'email',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 150,
      },
      {
        id: 'password',
        name: 'Password',
        field: 'password',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
      },
      {
        id: 'actions',
        name: 'Actions',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromExport: true,
        excludeFromQuery: true,
        excludeFromHeaderMenu: true,
        formatter: () => `<button class="btn-edit">Edit</button> <button class="btn-delete">Delete</button>`,
        minWidth: 120,
        maxWidth: 120,
        onCellClick: (e: Event, args: any) => {
          const target = e.target as HTMLElement;
          const item = args.dataContext;
          
          if (target.classList.contains('btn-edit')) {
            this.startEdit(item);
          } else if (target.classList.contains('btn-delete')) {
            if (confirm('Are you sure you want to delete this user?')) {
              this.deleteUser(item._id, item._rev);
            }
          }
        }
      }
    ];

    this.gridOptions = {
      autoResize: {
        container: '#grid-container',
        rightPadding: 10
      },
      
      enableFiltering: true,
      enableSorting: true,
      enableCellNavigation: true,
      editable: false,
      autoEdit: false,
      enableExcelCopyBuffer: true,
      rowHeight: 33,
      headerRowHeight: 35,
      enablePagination: true,
      pagination: {
        pageSizes: [10, 20, 50],
        pageSize: 5,
        totalItems: 0 
      },
    };
  }

  onAngularGridCreated(angularGrid: any) {
    this.angularGrid = angularGrid;
  }

  fetchUsers() {
    this.couch.getUsers().subscribe({
      next: (response: any) => {
        // Map CouchDB documents to include both id and _id
        this.dataset = response.rows.map((row: any) => ({
          ...row.doc,
          id: row.doc._id // Add id property required by SlickGrid
        }));
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
    this.editUserData = { ...user };
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
        this.cancelEdit();
      },
      error: (err) => console.log("Update error", err)
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editUserData = { _id: '', _rev: '', username: '', email: '', password: '' };
  }
}