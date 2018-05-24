import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';

@Injectable()

export class CustomService {

    private loading: any;

    constructor(
        private l: LoadingController,
        private toastCtrl: ToastController
    ) { }

    public showLoader(text?: string) {

        this.loading = this.l.create({
            content: text || 'Please wait...'
        });
        this.loading.present();
    }

    public hideLoader() { this.loading.dismiss(); }

    public showToast(msg, pos?: string, showCloseBtn?: boolean) {

        const toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: pos || 'bottom',
            showCloseButton: showCloseBtn,
            closeButtonText: 'Ok'
        });
       toast.present();
    }

}