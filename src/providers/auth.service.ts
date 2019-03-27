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

}
