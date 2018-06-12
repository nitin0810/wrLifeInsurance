import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllDefinitionsPage } from './all-definitions';

@NgModule({
  declarations: [
    AllDefinitionsPage,
  ],
  imports: [
    IonicPageModule.forChild(AllDefinitionsPage),
  ],
})
export class AllDefinitionsPageModule {}
