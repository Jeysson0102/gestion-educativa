import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [{ path: '', component: UserListComponent }];

@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UsersModule { }