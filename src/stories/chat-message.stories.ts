import { Story, Meta } from '@storybook/angular/types-6-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';

import { ChatMessageComponent } from './chat-message-component';
import { ChatMessageAttachmentImageComponent } from './chat-message-attachment-image-component';
import { ChatMessageAttachmentMultiImageComponent } from './chat-message-attachment-multi-image-component';
import { ChatMessageAttachmentPdfComponent } from './chat-message-attachment-pdf-component';
import { ChatMessageAttachmentVideoComponent } from './chat-message-attachment-video-component';

import { AttachmentDirective } from './chat-message-attachment-directive';

export default {
  title: 'Chat-Message',
  argTypes: { 
    onRetry: {
      action: 'retry' 
    },   
    showImageViewer: {
      action: 'showImageViewer'
    },  
    type: {
      control : {
        type: 'inline-radio',
        options : ['customer', 'agent', 'auto' ]
      }
    },      
    status: {
      control : {
        type: 'inline-radio',
        options : ['sending', 'sent', 'delivered', 'seen', 'failed' ]
      }
    },
    attachments: {
      control : {
        type : 'object',
        disable: true
      }
    }   
  }
} as Meta; 

const Template: Story<ChatMessageComponent> = (args: ChatMessageComponent) => ({
  moduleMetadata: {
    imports: [
      ButtonModule,
      CardModule,
      MenuModule,
      ToggleButtonModule,
      MenubarModule,
      TooltipModule,
      BrowserAnimationsModule
    ],
    declarations: [
      ChatMessageAttachmentImageComponent,
      ChatMessageAttachmentMultiImageComponent,    
      ChatMessageAttachmentPdfComponent,  
      ChatMessageAttachmentVideoComponent,        
      AttachmentDirective
    ],
    entryComponents: [
      ChatMessageAttachmentImageComponent,
      ChatMessageAttachmentMultiImageComponent,
      ChatMessageAttachmentPdfComponent,
      ChatMessageAttachmentVideoComponent
    ]
  },
  component: ChatMessageComponent, 
  props: args,
});

export const Customer = Template.bind({});
Customer.args =  {
  message: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostr.',
  type: 'customer',
  name: 'james',
  status: 'sending'
}

export const Agent = Template.bind({});
Agent.args =  {
  message: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostr.',
  type: 'agent',
  name: 'Nigel',
  status: 'sending'
}

export const Auto = Template.bind({});
Auto.args =  {
  message: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostr.',
  type: 'auto',
  name: 'Auto',
  status: 'sending'
}

export const Attachment1Image = Template.bind({});
Attachment1Image.args =  {
  message: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostr.',
  type: 'customer',
  name: 'james',
  status: 'sending',
  attachments: [{
    "url": "/stories/assets/images/img5.png",
    "size": "273.4Kb",
    "mimeType": "image/png"
  }]
}
export const Attachment3Images = Template.bind({});
Attachment3Images.args =  {
  message: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostr.',
  type: 'customer',
  name: 'james',
  status: 'sending',
  attachments: [
    {
      "url": "/stories/assets/images/img5.png",
      "size": "68KB",
      "mimeType": "image/png"
    },
    {
      "url": "/stories/assets/images/img6.png",
      "size": "27.7KB",
      "mimeType": "image/png"
    },
    {
      "url": "/stories/assets/images/this_is_a_really_long_name_that_i_have_used.png",
      "size": "87KB",
      "mimeType": "image/png"
    },
  ]
}
export const Attachment5Images = Template.bind({});
Attachment5Images.args =  {
  message: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostr.',
  type: 'customer',
  name: 'james',
  status: 'sending',
  attachments: [
    {
      "url": "/stories/assets/images/this_is_a_really_long_name_that_i_have_used.png",
      "size": "87KB",
      "mimeType": "image/png"
    },
    {      
      "url": "/stories/assets/images/img3.png",
      "size": "87KB",
      "mimeType": "image/png"
    },
    {      
      "url": "/stories/assets/images/img1.png",
      "size": "87KB",
      "mimeType": "image/png"
    },
    {      
      "url": "/stories/assets/images/img6.png",
      "size": "87KB",
      "mimeType": "image/png"
    },
    {      
      "url": "/stories/assets/images/img5.png",
      "size": "87KB",
      "mimeType": "image/png"
    }
  ]      
}
export const AttachmentPdf = Template.bind({});
AttachmentPdf.args =  {
  message: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostr.',
  type: 'customer',
  name: 'james',
  status: 'sending',
  attachments: [
    {
      "url": "/stories/assets/pdf/test-document.pdf",
      "size": "271.3Kb",
      "mimeType": "application/pdf"
    }
  ]  
}
export const AttachmentPdfLongName = Template.bind({});
AttachmentPdfLongName.args =  {
  message: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostr.',
  type: 'customer',
  name: 'james',
  status: 'sending',
  attachments: [
    {
      "url": "/stories/assets/pdf/test-document-with-a-very-long-name-that-exceeds.pdf",
      "size": "271.3Kb",
      "mimeType": "application/pdf"
    }
  ]  
}
export const AttachmentPdfNoMessage = Template.bind({});
AttachmentPdfNoMessage.args =  {
  message: '',
  type: 'customer',
  name: 'james',
  status: 'sending',
  attachments: [
    {
      "url": "/stories/assets/pdf/test-document-with-a-very-long-name-that-exceeds.pdf",
      "size": "271.3Kb",
      "mimeType": "application/pdf"
    }
  ]  
}
export const AttachmentPdfImageMessage = Template.bind({});
AttachmentPdfImageMessage.args =  {
  message: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostr.',
  type: 'customer',
  name: 'james',
  status: 'sending',
  attachments: [
    {
      "url": "/stories/assets/images/img5.png",
      "size": "273.4Kb",
      "mimeType": "image/png"    
    },
    {
      "url": "/stories/assets/pdf/test-document-with-a-very-long-name-that-exceeds.pdf",
      "size": "271.3Kb",
      "mimeType": "application/pdf"
    }
  ]  
}
export const AttachmentPdf5ImagesMessage = Template.bind({});
AttachmentPdf5ImagesMessage.args =  {
  message: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostr.',
  type: 'customer',
  name: 'james',
  status: 'sending',
  attachments: [
    {
      "url": "/stories/assets/images/this_is_a_really_long_name_that_i_have_used.png",
      "size": "87KB",
      "mimeType": "image/png"
    },
    {      
      "url": "/stories/assets/images/img3.png",
      "size": "87KB",
      "mimeType": "image/png"
    },
    {      
      "url": "/stories/assets/images/img1.png",
      "size": "87KB",
      "mimeType": "image/png"
    },
    {      
      "url": "/stories/assets/images/img6.png",
      "size": "87KB",
      "mimeType": "image/png"
    },
    {      
      "url": "/stories/assets/images/img5.png",
      "size": "87KB",
      "mimeType": "image/png"
    },
    {
      "url": "/stories/assets/pdf/test-document-with-a-very-long-name-that-exceeds.pdf",
      "size": "271.3Kb",
      "mimeType": "application/pdf"
    }
  ] 
}
export const AttachmentVideo = Template.bind({});
AttachmentVideo.args =  {
  message: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostr.',
  type: 'customer',
  name: 'james',
  status: 'sending',
  attachments: [{
    "url": "/stories/assets/video/Big_Buck_Bunny_360_10s_1MB.mp4",
    "size": "273.4Kb",
    "mimeType": "video/mp4"
  }]
}