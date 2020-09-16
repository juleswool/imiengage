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
    },/*
    status: {
      control : {
        type: 'inline-radio',
        options : ['none', 'dialling', 'ringing']
      }
    },*/
    channel: {
      control : {
        type: 'inline-radio',
        options : ['facebook', 'livechat', 'twitter', 'whatsapp']
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
  otherParty: "0148000001",
  active: false,
  info: 'Hello there. I am facing some problems',
  delivered: false,
  priority: "P2",
  channel: 'facebook'
}