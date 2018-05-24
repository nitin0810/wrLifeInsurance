
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

@Injectable()
export class NetworkService {

    constructor(private events: Events, private network: Network) { }

    checkNetworkStatus() {

        this.network.onConnect().subscribe(() => {

            this.events.publish("online");
        });
        this.network.onDisconnect().subscribe(() => {
            
            this.events.publish("offline");
        });
    }

}

