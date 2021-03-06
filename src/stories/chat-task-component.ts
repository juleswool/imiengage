import { Component, OnInit, Input, Output, OnChanges, EventEmitter, SimpleChanges, NgZone } from '@angular/core';
import { ButtonModule } from 'primeng/button/';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';
import { interval, timer } from 'rxjs';

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
    priorityColour:string = "#E02020";

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
    extend: boolean = false;
    
    @Input()
    extendTimeout: number = 15;

    @Output()
    onClick = new EventEmitter<any>();
    onSelect = new EventEmitter<boolean>();

    statusMsg: string = "";
    selected: boolean = false;
    channelIcon: string = "";
    extendTimeoutTimer: any = null;
    extendTimeLeft: number;

    constructor(private ngZone: NgZone) {
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
          case "extendTimeout":
            this.extendTimeLeft = changes[propName].currentValue || 15;
            break;

          case "extend":
            if (changes[propName].currentValue===true) {
              //make sure time runs inside zone so angular 
              //angular change detection works and the UI is refreshed
              this.ngZone.run(()=> {
                this.extendTimeoutTimer = setInterval(() => {   
                  this.extendTimeLeft = this.extendTimeLeft - 1;
                  if (this.extendTimeLeft===0) {
                    clearInterval(this.extendTimeoutTimer);
                    this.extendTimeoutTimer = null;
                  } 
                }, 1000);
              })

            } else {
              if (this.extendTimeoutTimer) {
                clearInterval(this.extendTimeoutTimer);
                this.extendTimeLeft = this.extendTimeout;
              }
            }
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