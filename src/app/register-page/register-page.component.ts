import { Component} from '@angular/core';
import { CouchdbService } from '../couchdb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  user = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private couch: CouchdbService, private router:Router) {}

  addUsers() {
    const data = {
      _id: `${this.user.username}_${this.user.email}`,
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
      type: 'register'
    };

    this.couch.createUserViaNode(data).subscribe({
      next: () => {
        alert("Registered successfully");
        this.user = { username: '', email: '', password: '' };
        this.router.navigate(['registered-users'])
      },
      error: (error:any) => {
        alert("Error registering user");
        console.log(error);
      }
    });
  }

  resetForm() {
    this.user = {
      username: '',
      email: '',
      password: '',
    };
  }




}
