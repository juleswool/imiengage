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

import { ThumbnailComponent } from './thumbnail-component';

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
      ThumbnailComponent
    ],
    entryComponents: [
    ]
  },
  component: ImageViewerComponent, 
  props: args,
});

export const Images = Template.bind({});
Images.args =  {
  images: [
        "/stories/assets/images/img8.jpg",
        "/stories/assets/images/img9.jpg",
        "/stories/assets/images/img10.jpg",
        "/stories/assets/images/img11.jpg",
        "/stories/assets/images/img12.jpg",
        "/stories/assets/images/img13.jpg",
        "/stories/assets/images/img14.jpg",
        "/stories/assets/images/img15.jpg"
  ],
  showViewer:true,
}
/*
"https://picsum.photos/id/1025/4951/3301.jpg",
"https://picsum.photos/id/1024/1920/1280.jpg",
"https://picsum.photos/id/1020/4288/2848.jpg",
"https://picsum.photos/id/1018/3914/2935.jpg",
"https://picsum.photos/id/1021/2048/1206.jpg",
"https://picsum.photos/id/102/4320/3240.jpg",
"https://picsum.photos/id/1005/5760/3840.jpg",
"https://picsum.photos/id/1012/3973/2639.jpg"
*/