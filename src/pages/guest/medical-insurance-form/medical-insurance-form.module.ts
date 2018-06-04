import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalInsuranceFormPage } from './medical-insurance-form';
import { PrevnextComponentPageModule } from '../prevnext-component/prevnext-component.module';

@NgModule({
  declarations: [
    MedicalInsuranceFormPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalInsuranceFormPage),
    PrevnextComponentPageModule
  ],
})
export class MedicalInsuranceFormPageModule {}
