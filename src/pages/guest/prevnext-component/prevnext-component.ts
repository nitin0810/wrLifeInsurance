import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-prevnext-component',
  templateUrl: 'prevnext-component.html',
})
export class PrevnextComponentPage {

  @Input() isDisabled: boolean;
  @Output() prev: EventEmitter<null> = new EventEmitter();
  @Output() next: EventEmitter<null> = new EventEmitter();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onPrevBtn() { this.prev.emit(); }

  onNextBtn() { this.next.emit(); }



}
