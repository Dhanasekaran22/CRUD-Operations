import { Component, OnInit } from '@angular/core';
import { CouchdbService } from '../couchdb.service';
import { AngularGridInstance, Column, GridOption, OnClickEventArgs } from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.css']
})
export class RegisteredUsersComponent implements OnInit {

  users: any[] = [];
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  isEditing = false;

  editUserData: any = {
    _id: '',
    _rev: '',
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private couch: CouchdbService,
    private translate: TranslateService // Directly inject TranslateService here
  ) {}

  ngOnInit(): void {
    this.initializeGrid();
    this.fetchUsers();
  }

  initializeGrid() {
    this.columnDefinitions = [
      { id: 'username', name: 'Username', field: 'username', sortable: true },
      { id: 'email', name: 'Email', field: 'email', sortable: true },
      { id: 'password', name: 'Password', field: 'password', sortable: true },
      {
        id: 'actions',
        name: 'Actions',
        field: '',
        formatter: () => `
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Delete</button>
        `,
        sortable: false,
        excludeFromExport: true
      }
    ];

    this.gridOptions = {
      enableSorting: true,
      enableCellNavigation: true,
      // enableAutoResize: true,
      // autoFitColumnsOnFirstLoad: true,
      // enableColumnReorder: false
    };
  }

  gridReady(grid:AngularGridInstance) {
    // const angularGrid = grid ;
    const slickGrid = grid?.slickGrid;

    if (!slickGrid) {
      console.error('Grid not initialized');
      return;
    }

    // Ensure the grid is ready and then apply autosizeColumns
    // setTimeout(() => {
    //   if (slickGrid) {
    //     slickGrid.autosizeColumns();
    //   }
    // }, 100); // Delay to ensure the grid is initialized

    // Attach row action events
    slickGrid.onClick.subscribe((event: Event, args: OnClickEventArgs) => {
      const target = event.target as HTMLElement;
      const rowItem = this.users[args.row];

      if (target.classList.contains('btn-edit')) {
        this.startEdit(rowItem);
      } else if (target.classList.contains('btn-delete')) {
        this.deleteUser(rowItem._id, rowItem._rev);
      }
    });
  }

  fetchUsers() {
    this.couch.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.rows.map((row: any, index: number) => {
          row.doc.id = index;
          return row.doc;
        });
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
