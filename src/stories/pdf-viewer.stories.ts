import { Story, Meta } from '@storybook/angular/types-6-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { PdfViewerModule } from 'ng2-pdf-viewer'

import { PdfDocumentComponent } from './pdf-viewer-component';

export default {
  title: 'Pdf-Viewer',
  argTypes: { 
  }
} as Meta; 

const Template: Story<PdfDocumentComponent> = (args: PdfDocumentComponent) => ({
  moduleMetadata: {
    imports: [
      ButtonModule,
      CardModule,
      MenuModule,
      ToggleButtonModule,
      MenubarModule,
      TooltipModule,
      BrowserAnimationsModule,
      PdfViewerModule
    ],
    declarations: [
    ],
    entryComponents: [
    ]
  },
  component: PdfDocumentComponent, 
  props: args,
});

export const Images = Template.bind({});
Images.args =  {
  pdfSrc: "/stories/assets/pdf/test-document.pdf",
  showViewer:true,
}

