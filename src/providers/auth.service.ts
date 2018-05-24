import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
declare var URLPREFIX;
declare var ROLE;


@Injectable()
export class AuthService {

    constructor(private http: CustomHttpService) { }

    // Notification token update after user login
    // tokenUpdate(token) {
    //     const notificationToken: Object = {
    //         notificationToken: token
    //     }
    //     return this.http.put('/update', notificationToken)
    // }

    login(loginCredentials: any) {
        return this.http.postForLogin(loginCredentials);
    }

    isLoggedIn() {
        return localStorage.getItem('access_token') ? true : false;
    }

    saveToken(token: string) {
        localStorage.setItem('access_token', token);
    }

    fetchUserDetails() {
        return this.http.get('/user-info').map((res) => {
            this.saveUserDetails(res);
            return res;
        });
    }

    saveUserDetails(userInfo: any) {
        this.setRole(userInfo);

        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }

    setRole(info: any) {
        // urlPrefix will be 'g' for guest, 'a' for admin/management, 'sa' for superadmin
        URLPREFIX = info.urlPrefix;
        // set ROLE in case of admin/mngmnt only, set default ROLE as first role in array
        if (URLPREFIX === 'a') {
            ROLE = info.roles[0];
        }
    }


}
