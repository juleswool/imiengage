import { Component, OnInit, Input, Output, OnChanges, EventEmitter, SimpleChanges  } from '@angular/core';
import { ButtonModule } from 'primeng/button/';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-chat-message',
    templateUrl: './chat-message-component.html',
    styleUrls: ['./chat-message-component.scss']
  })

export class ChatMessageComponent implements OnInit {
    /**
     * control inputs
     */
    @Input()
    priority?: string = "P1";

    @Input()
    messageCount?: string = "1";

    @Input()
    otherParty?: string = "01483000007";

    @Input()
    active?: boolean = false;

    @Input()
    message?: string = "";

    @Input()
    duration?: string = "00:00:00";

    @Input()
    state : 'offered' | 'accepted' = 'offered';

    @Input()
    inactivity: boolean = false;

    @Output()
    onClick = new EventEmitter<any>();
    onSelect = new EventEmitter<boolean>();

    statusMsg: string = "";
    selected: boolean = false;
    channelIcon: string = "";

    constructor() {
    }

    //
    // function   : chat tile selection change
    //
    // parameters : none.
    //
    // returns    : none.
    //    
    selectChange() {
      this.selected = !this.selected;
      this.onSelect.emit(this.selected);
    }

    //
    // function   : monitor for property changes
    //
    // parameters : changes - property change object
    //
    // returns    : none.
    //    
    ngOnChanges (changes: SimpleChanges) {
      for (const propName in changes) {
        switch (propName) {
          case "selected":
            console.log("selected");
            break;

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
        }
      }
    }

    //
    // function   : component initialisation event handler
    //
    // parameters : none.
    //
    // returns    : none.
    //    
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