import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { AuthService } from '../../../providers/auth.service';
import { CustomService } from '../../../providers/custom.service';
import { Camera } from '@ionic-native/camera';
import { BASE_PHP_URL } from '../../../providers/app.constants';
import { File } from '@ionic-native/file/ngx';


@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {

  policies: Array<any>;
  loadingPolicies = false;
  userDetails: any;
  userImg = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private customService: CustomService,
    public modalCtrl: ModalController,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private file: File
  ) {
    this.setUserDetails();
  }

  setUserDetails() {
    this.userDetails = JSON.parse(localStorage.getItem('userInfo'));
    // append img url with a timestamp to make the url unique, otherwise
    // updated img is not rendered as browser uses the cached img
    const ts = new Date().toISOString().slice(0, -5);
    this.userImg = this.userDetails.profile ? `${BASE_PHP_URL}/images/${this.userDetails.profile}?ts=${ts}`
      : 'assets/imgs/default_pic.png';
  }

  ionViewDidLoad() {
    this.getPolicies();
  }

  getPolicies() {
    this.loadingPolicies = true;
    this.authService.fetchPolicies()
      .subscribe((res: any) => {
        this.policies = res;
        this.loadingPolicies = false;
      }, (err: any) => {
        this.customService.showToast(err.msg);
        this.loadingPolicies = false;
      });
  }

  openPolicyDetail(policy: any) {
    this.navCtrl.push('PolicyDetailPage', { policy: policy });
  }

  openAccountEditPage() {
    this.navCtrl.push('AccountEditPage', { 'callBack': () => { this.setUserDetails(); } });

  }

  changePassword() {
    this.navCtrl.push('ChangePasswordPage');
  }


  onPicEdit() {
    const actionSheet = this.actionSheetCtrl.create({

      title: 'Select Image from',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.fromCamera(this.camera.PictureSourceType.CAMERA);
          }

        },
        {
          text: 'Gallery',
          handler: () => {
            this.fromCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  fromCamera(source: any) {
    this.camera.getPicture(this.cameraOptions(source))
      .then((imageData) => {
        // alert(this.imgPic);
        this.isImageSizeWithinRange(imageData).then(() => {

          this.uploadEditedImg(imageData);
        })
        .catch(err=>{
          if (!err) { this.customService.showToast('Image should be less than 1 Mb.'); }
          else { this.customService.showToast(typeof err === 'string' ? err : JSON.stringify(err)); }
        });
      }, (err: any) => {
        /**handle the case when camera opened, but pitcure not taken */
        // console.log('inisde camera 2nd clbk');
      })
      .catch((err: any) => {
        this.customService.showToast('Error occured,Try again');
      });
  }


  cameraOptions(source: any) {
    return {
      quality: 30,
      destinationType: this.camera.DestinationType.FILE_URI,  // 0-DATA-URL, 1-FILE-URI
      sourceType: source,       // 0-PHOTOLIBRARY, 1- CAMERA
      encodingType: this.camera.EncodingType.JPEG,     // 0-JPEG, 1-PNG
      allowEdit: true,
      correctOrientation: true
    }
  }

  isImageSizeWithinRange(fileURI: string) {
    return new Promise((res, rej) => {

      window['resolveLocalFileSystemURL'](fileURI, function (fileEntry) {

        fileEntry.getMetadata(function (metadata) {
          // alert(JSON.stringify(metadata));
          if (metadata.size > 1048576) {
            rej();
          } else {
            res();
          }
        }, rej);

      },
        rej);

    });
  }

  uploadEditedImg(img: string) {
    // alert(JSON.stringify('inside uploadEditedImg'+img));
    // debugger;
    this.customService.showLoader('Updating Image...');
    this.authService.uploadPic(img, { membership_number: this.userDetails.membership_number })
      .then((res: any) => {
        this.customService.hideLoader();
        // alert(JSON.stringify(res, undefined, 2));
        this.updateImageInMemeory(JSON.parse(res.response));
        this.customService.showToast('Image updated successfully');
      })
      .catch((err: any) => {
        // alert(JSON.stringify(err, undefined, 2));

        this.customService.hideLoader();
        try {
          let error = JSON.parse(err.body);
          let errMsg = error.message || error.error || "Some Error Occured,Couldn't Update Image";
          this.customService.showToast(errMsg);
        } catch (e) {
          this.customService.showToast(e.toString() || 'Some unexpected error occured');
        }
      });
  }

  updateImageInMemeory(imgUrl: string) {
    //img is complete url of the image
    // we just need to store the image name from that url
    const img = imgUrl.slice(imgUrl.lastIndexOf('/') + 1);
    const updatedUserinfo = JSON.parse(localStorage.getItem('userInfo'));
    updatedUserinfo.profile = img;
    localStorage.setItem('userInfo', JSON.stringify(updatedUserinfo));
    // update the image visible on the same page
    // this.userImg = `${BASE_PHP_URL}/images/${img}`;
    setTimeout(() => {
      this.setUserDetails();

    });

  }
}
