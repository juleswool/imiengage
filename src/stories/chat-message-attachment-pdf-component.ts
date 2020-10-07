import { Input, ViewChild, ElementRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { ChatMessageAttachment } from './chat-message-attachment';
import { ChatMessageAttachmentImageComponent } from './chat-message-attachment-image-component';

@Component({
    selector: 'app-chat-message-attachment-pdf',
    templateUrl: './chat-message-attachment-pdf-component.html',
    styleUrls: ['./chat-message-attachment-pdf-component.scss']
  })

export class ChatMessageAttachmentPdfComponent implements OnInit, AfterViewInit {
    
    readonly attachmentType:string = "pdf";

    attachmentName: string = "";  
    attachmentNameTooltip:string = "";
    @ViewChild('attachmentName') attachmentNameElement: ElementRef;

    @Input()
    attachment: ChatMessageAttachment;

    @Input() 
    showBorder: boolean = false;

    constructor() {
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

    ngAfterViewInit() {
      let attachmentNameElement: HTMLDivElement = this.attachmentNameElement.nativeElement;
      if (attachmentNameElement.scrollWidth > attachmentNameElement.clientWidth) {
        this.attachmentNameTooltip = this.getAttachmentName();
      }
    }

    getAttachmentName() {
      if (!this.attachmentName) {
        let parts:string[] = this.attachment.url.split('/');
        this.attachmentName = parts[parts.length-1];
      }
      return (this.attachmentName);
    }    
}