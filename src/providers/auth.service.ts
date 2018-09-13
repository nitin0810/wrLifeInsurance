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

    sendLinkedinToken(token: string) {
        return this.http.get(`/linkedin/login?access_token=${token}`);
    }


    sendFacebokToken(token: string) {
        return this.http.get(`/fb/login?access_token=${token}`);
    }

    login(username: string, password: string) {
        return this.http.post(`/oauth/token?grant_type=password&username=${username}&password=${password}`,{});
    }


}
