import { AlertController, Events, App, MenuController } from 'ionic-angular';
import { AuthService } from '../providers/auth.service';
import { NetworkService } from '../providers/network.service';

import { LoginPage } from '../pages/login/login';
import { CustomService } from '../providers/custom.service';
import { GuestHomePage } from '../pages/guest/home/home';

declare var URLPREFIX;
declare var ROLE;
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
        // this.events.subscribe('session:expired', () => {
        //     this.sessionExpired();
        // });
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
        this.rootPage = LoginPage;

        // if (this.authService.isLoggedIn()) {
        //     this.authService.fetchUserDetails()
        //         .subscribe((res) => {
        //             // no need to do any thing as userdetails would have been saved in service
        //             this.setRootPage();
        //             this.enablePushNotifications();
        //         }, (err: any) => {
        //             this.customService.showToast('Some error occured, Please Reopen the App or Logout');
        //         });

        // } else {
        //     this.rootPage = LoginPage;
        // }
    }

    public login() {
        this.setRootPage();
        this.enablePushNotifications();
        // this.imageUpdate();
    }

    enablePushNotifications() {
        // this.pushMsgService.initializeFCM();
    }

    setRootPage() {

        this.menu.enable(true);
        this.appCtrl.getRootNavs()[0].setRoot(GuestHomePage);
        this.decideSideMenuContent();
        //check role and set root page
        // const role = JSON.parse(localStorage.getItem('userInfo')).urlPrefix;

        // switch (role) {
        //     case 'g':
        //         this.menu.enable(false);
        //         this.appCtrl.getRootNavs()[0].setRoot(GuestHomePage);
        //         this.isGuest = true;
        //         break;

        //     case 'sa':
        //         this.appCtrl.getRootNavs()[0].setRoot(GuestHomePage);
        //         this.decideSideMenuContent();
        //         this.menu.enable(true);
        //         this.isGuest = false;
        //         break;

        //     case 'a':
        //         this.appCtrl.getRootNavs()[0].setRoot(GuestHomePage);
        //         this.decideSideMenuContent();
        //         this.menu.enable(true);
        //         this.isGuest = false;
        //         break;
        // }
        // this.imageUpdate();
    }

    /**maintain different side menu options for super-admin and managment for better understanding and also there might be some features
     * present in one but not in other
     */
    decideSideMenuContent() {

        
        this.sideMenuOptions = [

            { title: 'Home', component: GuestHomePage, icon: 'home', color:"green" },
            { title: 'Buy Shares', component: "BuySharesPage", icon: 'ios-cash', color:"green" },
            { title: 'Why Choose Us', component: "WhyChooseUsPage", icon: 'bulb', color:"green" },
            { title: 'Visiblity', component: "VisiblityPage",  icon: 'thumbs-up', color:"green" },
            { title: 'Ethics', component: "EthicsPage",  icon: 'paper', color:"green" },
            { title: 'Good Price', component: "GoodPricePage",  icon: 'paper', color:"green" },
            { title: 'Contact Us', component: "ContactUsPage",  icon: 'call', color:"green" },
            { title: 'Sign Out', component: null,  icon: 'log-out', color:"green" },

        ];
        return;

        // const isSuperAdmin: boolean = JSON.parse(localStorage.getItem('userInfo')).urlPrefix === 'sa';

        // if (isSuperAdmin) {

        //     this.sideMenuOptions = [

        //         { title: 'Home', component: GuestHomePage, icon: 'home' },
        //         { title: 'Complaints', component: "ComplaintsPage", icon: 'sad' },
        //         { title: 'Suggestions', component: "SuggestionsPage", icon: 'bulb' },
        //         { title: 'Appreciations', component: "AppreciationsPage", show: isSuperAdmin, icon: 'thumbs-up' },
        //         { title: 'Surveys', component: "SurveyPage", show: isSuperAdmin, icon: 'paper' },
        //         { title: 'Stores', component: "StoresPage", show: isSuperAdmin, icon: 'basket' },
        //         { title: 'Employees', component: "EmployeesPage", show: isSuperAdmin, icon: 'people' },
        //         // { title: 'Appreciations', component: "AppreciationTabsPageStudent", icon: 'assets/icon/appreciation.jpg' },
        //         // { title: 'Polls', component: "PollStudent", icon: 'assets/icon/poll.jpg' },
        //         // { title: 'Surveys', component: "SurveyPageStudent", icon: 'assets/icon/survey.jpg' },
        //         // { title: 'Circular', component: "CircularStudentListPage", icon: 'assets/icon/circular.jpg' },
        //         // { title: 'Events', component: "MainPlannerPageManagement", icon: 'assets/icon/event.jpg' },
        //         // { title: 'Assignment', component: "AssignmentTabsPageStudent", icon: 'assets/icon/rating.jpg' },
        //         // { title: 'Assessment', component: "AssessmentTabsPageStudent", icon: 'assets/icon/rating.jpg' },
        //         // { title: 'Time Table', component: "TimeTablePageStudent", icon: 'assets/icon/rating.jpg' },
        //         // { title: 'Account', component: "AccountPage", icon: 'assets/icon/profile.jpg' },

        //     ];
        // } else {

        //     this.sideMenuOptions = [

        //         { title: 'Home', component: GuestHomePage, icon: 'home' },
        //         { title: 'Complaints', component: "ComplaintsPage", icon: 'sad' },
        //         { title: 'Suggestions', component: "SuggestionsPage", icon: 'bulb' },
        //         { title: 'Appreciations', component: "AppreciationsPage", show: isSuperAdmin, icon: 'thumbs-up' },
        //         { title: 'Surveys', component: "SurveyPage", show: isSuperAdmin, icon: 'paper' },
        //         // { title: 'Appreciations', component: "AppreciationTabsPageStudent", icon: 'assets/icon/appreciation.jpg' },
        //         // { title: 'Polls', component: "PollStudent", icon: 'assets/icon/poll.jpg' },
        //         // { title: 'Surveys', component: "SurveyPageStudent", icon: 'assets/icon/survey.jpg' },
        //         // { title: 'Circular', component: "CircularStudentListPage", icon: 'assets/icon/circular.jpg' },
        //         // { title: 'Events', component: "MainPlannerPageManagement", icon: 'assets/icon/event.jpg' },
        //         // { title: 'Assignment', component: "AssignmentTabsPageStudent", icon: 'assets/icon/rating.jpg' },
        //         // { title: 'Assessment', component: "AssessmentTabsPageStudent", icon: 'assets/icon/rating.jpg' },
        //         // { title: 'Time Table', component: "TimeTablePageStudent", icon: 'assets/icon/rating.jpg' },
        //         // { title: 'Account', component: "AccountPage", icon: 'assets/icon/profile.jpg' },

        //     ];
        // }

    }

    public imageUpdate() {

        this.userImage = JSON.parse(localStorage.getItem('userInfo')).picUrl;
        this.userName = JSON.parse(localStorage.getItem('userInfo')).username || '';
    }

    public logout() {

        localStorage.clear();
        URLPREFIX = undefined;
        ROLE = undefined;
        this.appCtrl.getRootNavs()[0].setRoot(LoginPage);
    }

    public offline() {
        // if (this.authService.isLoggedIn()) {

        //     this.appCtrl.getRootNavs()[0].setRoot(NoInternet);
        // }
    }

    public online() {
        // if (this.authService.isLoggedIn()) {
        //     this.login();
        // } else {
        //     this.logout();
        // }
    }


    // public sessionExpired() {

    //     let alert = this.alertCtrl.create({
    //         title: 'Session Expired',
    //         message: "You're already logged in some other device. You may again login.",
    //         enableBackdropDismiss: false,
    //         buttons: [{
    //             text: 'Logout',
    //             handler: () => {
    //                 this.events.publish("user:logout");
    //             }
    //         }]
    //     });
    //     alert.present();
    // }


}


