import { Component, OnInit, Input, Output, OnChanges, EventEmitter, SimpleChanges  } from '@angular/core';
import { ButtonModule } from 'primeng/button/';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-chat-task',
    templateUrl: './chat-task-component.html',
    styleUrls: ['./chat-task-component.scss']
  })

export class ChatTaskComponent implements OnInit {
    /**
     * control inputs
     */
    @Input()
    priority?: string = "P1";

    @Input()
    otherParty?: string = "01483000007";

    @Input()
    active?: boolean = false;

    @Input()
    info?: string = "";

    @Input()
    duration?: string = "00:00:00";

    @Input()
    delivered? :boolean = false;

    @Input()
    status : 'none' | 'dialling' | 'ringing' = 'none';

    @Output()
    onClick = new EventEmitter<any>();

    statusMsg: string = "";
    selected: boolean = true;
    channelIcon: string = "";

    busy:boolean = true;

    constructor() {
    }

    ngOnChanges (changes: SimpleChanges) {
      for (const propName in changes) {
        switch (propName) {
          case "channel":
            switch (changes[propName].currentValue) {
              case "facebook":
                this.channelIcon = "icon-Facebook";
                break;
              case "livechat":
                this.channelIcon = "icon-LiveChat";                
                break;
              case "twitter":
                this.channelIcon = "icon-Twitter";                
                break;
              case "whatsapp":
                this.channelIcon = "icon-Whatsapp";                
                break;
            }
            break;

          case "status":
            switch (changes[propName].currentValue) {
              case "dialling":
                this.statusMsg = "Dialling...";
                  break;
              case "ringing":
                this.statusMsg = "Ringing...";                
                break;
              default:
                this.statusMsg = "";
            }
            break;
        }
      }
    }

    ngOnInit() {

    }

    //
    // function   : is string contained in array
    //
    // parameters : arr  - arr to search
    //              item - string item to search for
    //
    // returns    : none.
    //
    itemInArray(arr, item) {
      var i;
      for (i=0; i < arr.length; i++) {
        if (item===arr[i]) {
          return (true);
        }
      }
      return (false);
    }
}