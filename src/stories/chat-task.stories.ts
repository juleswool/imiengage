import { Story, Meta } from '@storybook/angular/types-6-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';

import { ChatTaskComponent } from './chat-task-component';

export default {
  title: 'Interaction-Tile-Chat',
  argTypes: {
    onClick: {
      action: 'click' 
    },
    onSelect: {
      action: 'select' 
    },
    state: {
      control : {
        type: 'inline-radio',
        options : ['offered', 'accepted']
      }
    },
    channel: {
      control : {
        type: 'inline-radio',
        options : ['facebook', 'livechat', 'twitter', 'whatsapp']
      }
    },
    priorityColour: {
      control : {
        type: 'color'
      } 
    }    
  }
};

export const Chat = (args) => ({
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
  component: ChatTaskComponent,
  props: args,
});

Chat.args = {
  priorityColour: '#E02020',   
  otherParty: "Peter Carroll",
  duration: "00:01:33",
  active: false,
  message: 'Hello there. I am facing some problems with my laptop due to this hot weather',
  priority: "P2",
  channel: 'facebook',
  state: 'offered',
  messageCount: "1",
  extend: false,
  extendTimeout: 15
}