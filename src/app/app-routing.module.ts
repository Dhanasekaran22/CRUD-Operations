import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPageComponent } from './register-page/register-page.component';
import { RegisteredUsersComponent } from './registered-users/registered-users.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'register', component: RegisterPageComponent},
  { path: 'registered-users', component: RegisteredUsersComponent },
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: '/register', pathMatch: 'full' }, // default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
