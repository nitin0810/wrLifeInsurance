import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrevnextComponentPage } from './prevnext-component';

@NgModule({
  declarations: [
    PrevnextComponentPage,
  ],
  imports: [
    IonicPageModule.forChild(PrevnextComponentPage),
  ],
  exports:[PrevnextComponentPage]
})
export class PrevnextComponentPageModule {}
