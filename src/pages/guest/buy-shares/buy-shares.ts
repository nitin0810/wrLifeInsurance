import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-buy-shares',
  templateUrl: 'buy-shares.html',
})
export class BuySharesPage implements OnInit {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuySharesPage');
  }

  openContactPage(){
    this.navCtrl.push('ContactUsPage');
  }

  ngOnInit(){
    window.addEventListener('scroll',()=>{
      console.log('hello world');
    });
  }

  setAnimations(){
    var box:any = document.getElementsByClassName('delay-animation');
    console.log('done');
    for(var i=0; i<box.length;i++){
      var boxPos = box[i].offsetTop;
      var cursorPos = window.scrollY;

      console.log(boxPos,cursorPos);
      if(cursorPos >= boxPos - 800  ){
        box[i].classList.add('slideUp');
      }
      if(cursorPos > boxPos + 800 ){
        // box[i].classList.remove('animate');
      }
    }
  }

}
