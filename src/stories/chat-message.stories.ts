import { Story, Meta } from '@storybook/angular/types-6-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';

import { ChatMessageComponent } from './chat-message-component';

export default {
  title: 'Interaction-Tile-Chat-Message',
  argTypes: { 
  }
};

export const ChatMessage = (args) => ({
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
  component: ChatMessageComponent,
  props: args,
});

ChatMessage.args = {
  message: 'Hello there. I am facing some problems with my laptop due to this hot weather',
}