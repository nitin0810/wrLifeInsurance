import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { GuestHomePage } from '../pages/guest/home/home';
import { NetworkService } from '../providers/network.service';
import { AuthService } from '../providers/auth.service';
import { CustomHttpService } from '../providers/custom-http.service';
import { CustomService } from '../providers/custom.service';
import { HttpClientModule } from '@angular/common/http';
import { Network } from '@ionic-native/network';
import { LoginPage } from '../pages/login/login';
import { MedicalInsuranceService } from '../providers/medicalInsurance.service';
import { Stripe } from '@ionic-native/stripe';
// import { LinkedIn } from '@ionic-native/linkedin';
import { Facebook } from '@ionic-native/facebook';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
// import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [
    MyApp,
    GuestHomePage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      preloadModules: true,
      scrollPadding: false,
      scrollAssist: false
    }),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GuestHomePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Network,
    NetworkService,
    AuthService,
    CustomHttpService,
    CustomService,
    MedicalInsuranceService,
    Stripe,
    // LinkedIn,
    Facebook,
    Camera,
    FileTransfer,
    // File 
  ]
})
export class AppModule {}
