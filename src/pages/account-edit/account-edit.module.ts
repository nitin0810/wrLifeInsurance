import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountEditPage } from './account-edit';

@NgModule({
  declarations: [
    AccountEditPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountEditPage),
  ],
})
export class AccountEditPageModule {}
