import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignUpPage } from './sign-up';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SignUpPage,
  ],
  imports: [
    IonicPageModule.forChild(SignUpPage),
    ReactiveFormsModule
  ],
})
export class SignUpPageModule {}
