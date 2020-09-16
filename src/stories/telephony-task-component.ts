import { Component, OnInit, Input, Output, OnChanges, EventEmitter, SimpleChanges  } from '@angular/core';
import { ButtonModule } from 'primeng/button/';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-telephony-task',
    templateUrl: './telephony-task-component.html',
    styleUrls: ['./telephony-task-component.scss']
  })

export class TelephonyTaskComponent implements OnInit {
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

    @Input()
    onHold? : boolean = false;

    @Input()
    muted? : boolean = false;

    @Input()
    direction: 'inbound' | 'outbound' = 'inbound';

    @Output()
    onClick = new EventEmitter<any>();

    muteTooltip: string = "Mute";
    holdTooltip: string = "Hold";
    statusMsg: string = "";

    mouseHover:boolean = false;
    busy:boolean = true;

    items: MenuItem[];

    constructor() {
      //pop-up menu items
      this.items = [
          {
            id: 'toolRequeue', 
            label: 'Re-queue', 
            icon: 'icon-Requeue', 
            disabled : true,
            command: (event) => {
              this.onClick.emit({ 'id': event.item.id})
            }
          },
          {
            id: 'toolConference', 
            label: 'Conference', 
            icon: 'icon-conference', 
            disabled : true,
            command: (event) => {
              this.onClick.emit({ 'id': event.item.id})
            }
          },
          {
            id: 'toolInfo', 
            label: 'Call Info', 
            icon: 'icon-info', 
            disabled : true,
            command: (event) => {
              this.onClick.emit({ 'id': event.item.id})
            }
          },
          {
            id: 'toolDropcall', 
            label: 'Hang up', 
            icon: 'icon-hangup', 
            disabled : true,
            command: (event) => {
              this.onClick.emit({ 'id': event.item.id})
            }
          }, 
      ];
    }

    ngOnChanges (changes: SimpleChanges) {
      for (const propName in changes) {
        switch (propName) {
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

          case "onHold":
            this.mouseHover = this.muted || changes[propName].currentValue;  
            //refresh tooltips
            this.holdTooltip = this.onHold ? "Resume" : "Hold";
            break;

          case "muted":            
            this.mouseHover = this.onHold || changes[propName].currentValue;
            //refresh tooltips
            this.muteTooltip = changes[propName].currentValue ? "Unmute" : "Mute";
            break;

          case "toolbar":
            for (const itemId in changes[propName].currentValue) {
              for (let index=0; index < this.items.length; index++) {
                if (this.items[index].id===itemId) {
                  this.items[index].disabled = changes[propName].currentValue[itemId].disabled;
                  break;
                }
              }
            }
            break;

        }
      }
    }

    ngOnInit() {

    }

    showMenu(menu, event) {
      menu.show(event);
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

    //
    // function   : mouse out event handler. Need to distinquish between
    //              the mouse moving outside the component or hovering over
    //              a child component
    //
    // parameters : event - DOM event
    //
    // returns    : none.
    //
    mouseOut (event) {
      //this is the original element the event handler was assigned to
      var ignore = false, e = event.toElement || event.relatedTarget;

      //toolbar must remain visible if the call is held
      if (this.onHold || this.muted) {
        return;
      }

      //have we move to the task-item
      if (e!=null && this.itemInArray(e.classList, "ui-interaction-tile-content")) {
        return;
      }
      //traverse up the parents to determine if this is a child of the tile
      //or the tile itself, only interested in tile itself for mouseout event
      while (e!==null && e.parentNode.className && e.parentNode.className.indexOf("ui-interaction-tile")===-1) {
        if (this.itemInArray(e.parentNode.classList, "ui-interaction-tile-content")) {
          ignore=true;
          break;
        }
        e= e.parentNode;
      }
      if (!ignore) {
        this.mouseHover=false;      
      }
  }

}