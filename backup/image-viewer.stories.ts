import { Story, Meta } from '@storybook/angular/types-6-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';

import { ImageViewerComponent } from './image-viewer-component';
import { GalleriaModule } from 'primeng/galleria';

import { SliderComponent } from './slider-component';
import { SliderItemDirective } from './slider-item-directive';

export default {
  title: 'Image-Viewer',
  argTypes: { 
  }
} as Meta; 

const Template: Story<ImageViewerComponent> = (args: ImageViewerComponent) => ({
  moduleMetadata: {
    imports: [
      ButtonModule,
      CardModule,
      MenuModule,
      ToggleButtonModule,
      MenubarModule,
      TooltipModule,
      BrowserAnimationsModule,
      GalleriaModule
    ],
    declarations: [
      SliderComponent,
      SliderItemDirective
    ],
    entryComponents: [
    ]
  },
  component: ImageViewerComponent, 
  props: args,
});

export const Basic = Template.bind({});
Basic.args =  {
  images: [
    {
        "previewImageSrc": "https://picsum.photos/id/1025/4951/3301",
        "thumbnailImageSrc": "https://picsum.photos/id/1025/160/120",
        "alt": "Description for Image 1",
        "title": "Title 1"
    },
    {
        "previewImageSrc": "https://picsum.photos/id/1024/1920/1280",
        "thumbnailImageSrc": "https://picsum.photos/id/1024/160/120",
        "alt": "Description for Image 2",
        "title": "Title 2"
    },
    {
        "previewImageSrc": "https://picsum.photos/id/1020/4288/2848",
        "thumbnailImageSrc": "https://picsum.photos/id/1020/160/120",
        "alt": "Description for Image 3",
        "title": "Title 3"
    },
    {
        "previewImageSrc": "https://picsum.photos/id/1018/3914/2935",
        "thumbnailImageSrc": "https://picsum.photos/id/1018/160/120",
        "alt": "Description for Image 4",
        "title": "Title 4"
    },
    {
        "previewImageSrc": "https://picsum.photos/id/1021/2048/1206",
        "thumbnailImageSrc": "https://picsum.photos/id/1021/160/120",
        "alt": "Description for Image 5",
        "title": "Title 5"
    },
    {
        "previewImageSrc": "https://picsum.photos/id/102/4320/3240",
        "thumbnailImageSrc": "https://picsum.photos/id/102/160/120",
        "alt": "Description for Image 6",
        "title": "Title 6"
    },
    {
        "previewImageSrc": "https://picsum.photos/id/1005/5760/3840",
        "thumbnailImageSrc": "https://picsum.photos/id/1005/160/120",
        "alt": "Description for Image 7",
        "title": "Title 7"
    },
    {
        "previewImageSrc": "https://picsum.photos/id/1012/3973/2639",
        "thumbnailImageSrc": "https://picsum.photos/id/1012/160/120",
        "alt": "Description for Image 8",
        "title": "Title 8"
    }        
  ],
  idContainer:"idOnHTML",
  loadOnInit:true,
}


//'https://picsum.photos/900/500/?random