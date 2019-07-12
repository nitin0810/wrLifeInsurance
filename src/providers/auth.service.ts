import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { BASE_PHP_URL } from './app.constants';

@Injectable()
export class AuthService {

    constructor(private http: CustomHttpService,private fileTransfer:FileTransfer) { }

    isLoggedIn() {
        return localStorage.getItem('access_token') ? true : false;
    }

    saveToken(token: string) {
        localStorage.setItem('access_token', token);
    }

    fetchUserDetails() {
        return this.http.get('/user').map((res) => {
            this.saveUserDetails(res);
            return res;
        });
    }

    fetchPolicies() {
        return this.http.get('/user/policies');
    }

    saveUserDetails(userInfo: any) {
        // all objects in array are same
        // Hence, save only the first object
        localStorage.setItem('userInfo', JSON.stringify(userInfo[0]));
    }

    /**get userInfo from localstorage */
    getUserDetails() {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        return user;
    }

    // sendLinkedinToken(token: string) {
    //     return this.http.get(`/linkedin/login?access_token=${token}`);
    // }


    sendFacebokToken(token: string) {
        return this.http.get(`/fb/login?access_token=${token}`);
    }

    login(data: any) {
        return this.http.post(`/oauth/token?grant_type=password&username=${data.email}&password=${data.password}`, {});
    }

    signup(data: any) {
        return this.http.post('/signup',data);
    }

    forgotPassword(object: any){
        return this.http.put('/forgot-password',object);
    }

    changePassword(data:any){
        return this.http.put('/user/change-password',data);
    }

    editAccountDetails(data:any){
        return this.http.put('/user',data);
    }


       // PROFILE PIC ADDITION
       uploadPic(image: any,data:any) {
        let myFileName: string = this.generateImageName();

        let options: FileUploadOptions = {
            fileKey: 'picture',
            fileName: myFileName,
            mimeType: "multipart/form-data",
            chunkedMode: false,
            httpMethod: "POST",
            params:data
            // headers: {
            //     'Authorization': 'Bearer' + localStorage.getItem('access_token')
            // }
        }
        // alert('before upload');
        const transfer: any = this.fileTransfer.create();
        return transfer.upload(image, BASE_PHP_URL + `/api_photo_upload.php`, options, false);
    }

    generateImageName() {
        //generate unique imagename based on current date-time(upto seconds)
        let date = new Date().toISOString();
        return 'IMG_' + date.substring(0, date.indexOf('.')) + '.jpg';
    }
}
