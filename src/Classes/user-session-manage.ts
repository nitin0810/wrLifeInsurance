import { AlertController, Events, App, MenuController } from 'ionic-angular';
import { AuthService } from '../providers/auth.service';
import { NetworkService } from '../providers/network.service';

import { LoginPage } from '../pages/login/login';
import { CustomService } from '../providers/custom.service';
import { GuestHomePage } from '../pages/guest/home/home';

export class UserSessionManage {

    rootPage: any;
    sideMenuOptions: Array<any>;
    isGuest: boolean;
    userImage: string;
    userName: string;

    constructor(
        public events: Events,
        public appCtrl: App,
        public authService: AuthService,
        public alertCtrl: AlertController,
        public networkService: NetworkService,
        public menu: MenuController,
        public customService: CustomService,
    ) {

        this.handleEvents();
        this.networkService.checkNetworkStatus();
        this.hasLoggedIn();
    }

    public handleEvents() {
        this.events.subscribe('user:login', () => {
            this.login();
        });

        this.events.subscribe('user:logout', () => {
            this.logout();
        });
        this.events.subscribe("offline", () => {
            this.offline();
        });
        this.events.subscribe("online", () => {
            this.online();
        });
        this.events.subscribe("user:image", () => {
            this.imageUpdate();
        });
    }


    public hasLoggedIn() {
        // this.rootPage = LoginPage;

        if (this.authService.isLoggedIn()) {
            this.authService.fetchUserDetails()
                .subscribe((res) => {
                    // no need to do any thing as userdetails would have been saved in service
                    this.setRootPage();
                }, (err: any) => {
                    this.customService.showToast('Some error occured, Please login again');
                    localStorage.clear();
                    this.appCtrl.getRootNavs()[0].setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
                });

        } else {
            this.rootPage = LoginPage;
        }
    }

    public login() {
        this.setRootPage();
        // this.imageUpdate();
    }


    setRootPage() {

        this.menu.enable(true);
        this.appCtrl.getRootNavs()[0].setRoot(GuestHomePage, {}, { animate: true, direction: 'forward' });
        this.decideSideMenuContent();
    }


    decideSideMenuContent() {

        this.sideMenuOptions = [

            // { title: 'Home', component: GuestHomePage, icon: 'home', color: "green" },
            { title: 'Buy Shares', component: "BuySharesPage", icon: 'ios-cash', color: "green" },
            { title: 'Why Choose Us', component: "WhyChooseUsPage", icon: 'bulb', color: "green" },
            { title: 'Visiblity', component: "VisiblityPage", icon: 'thumbs-up', color: "green" },
            { title: 'Ethics', component: "EthicsPage", icon: 'paper', color: "green" },
            { title: 'Good Price', component: "GoodPricePage", icon: 'paper', color: "green" },
            { title: 'Contact Us', component: "ContactUsPage", icon: 'call', color: "green" },
            { title: 'Sign Out', component: null, icon: 'log-out', color: "green" },

        ];

        if (this.authService.isLoggedIn()) {
            this.sideMenuOptions.unshift(
                { title: 'My Account', component: "MyAccountPage", icon: 'ios-cash', color: "green" }
            );
        }
    }


    public imageUpdate() {

        this.userImage = JSON.parse(localStorage.getItem('userInfo')).picUrl;
        this.userName = JSON.parse(localStorage.getItem('userInfo')).username || '';
    }

    public logout() {

        localStorage.clear();
        this.appCtrl.getRootNavs()[0].setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
    }

    public offline() {
        this.customService.showToast('You are offline', 'top', true);

    }

    public online() {
        this.customService.showToast('Back Online', 'top', true);
    }

}


