import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';


@Injectable()
export class AuthService {

    constructor(private http: CustomHttpService) { }

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
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }

    /**get userInfo from localstorage */
    getUserDetails() {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (Array.isArray(user)) { return user[0]; }
        return user;
    }

    sendLinkedinToken(token: string) {
        return this.http.get(`/linkedin/login?access_token=${token}`);
    }


    sendFacebokToken(token: string) {
        return this.http.get(`/fb/login?access_token=${token}`);
    }

    login(data: any) {
        return this.http.post(`/oauth/token?grant_type=password&username=${data.email}&password=${data.password}`, {});
    }


}
