import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalInsuranceFormPage } from './medical-insurance-form';

@NgModule({
  declarations: [
    MedicalInsuranceFormPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalInsuranceFormPage),
  ],
})
export class MedicalInsuranceFormPageModule {}
