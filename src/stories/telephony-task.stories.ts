import { Story, Meta } from '@storybook/angular/types-6-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';

import { TelephonyTaskComponent } from './telephony-task-component';

export default {
  title: 'Telephony-Task',
  argTypes: {
    onClick: {
      action: 'click' 
    },
    direction: { 
      control : {
        type: 'inline-radio',
        options: ['inbound', 'outbound'],
      }
    },
    toolbar: {
      control : {
        type : 'object'
      }
    },
    state: {
      control : {
        type: 'inline-radio',
        options : ['none', 'dialling', 'ringing', 'connected' ]
      }
    },
    priorityColour: {
      control : {
        type: 'color'
      } 
    }
  }
};

export const Telephony = (args) => ({
  moduleMetadata: {
    imports: [
      ButtonModule,
      CardModule,
      MenuModule,
      ToggleButtonModule,
      MenubarModule,
      TooltipModule,
      BrowserAnimationsModule,
    ],
  },
  component: TelephonyTaskComponent,
  props: args,
});

Telephony.args = {
  priorityColour: '#E02020',  
  otherParty: "0148000001",
  active: false,
  info: 'Sales Enquiry',
  duration: "00:01:33",
  state: "none",
  priority: "P2",
  onHold: false,
  muted: false,
  direction: 'inbound',
  toolbar: { 
    'toolInfo' : { 
      'disabled' : false
    },
    'toolDropcall' : { 
      'disabled' : false 
    }
  }
}