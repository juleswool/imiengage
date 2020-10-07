import { Input, ViewChild, ElementRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { ChatMessageAttachment } from './chat-message-attachment';

@Component({
    selector: 'app-chat-message-attachment-image',
    templateUrl: './chat-message-attachment-image-component.html',
    styleUrls: ['./chat-message-attachment-image-component.scss']
  })

export class ChatMessageAttachmentImageComponent implements OnInit, AfterViewInit {
    
    readonly attachmentType:string = "image";

    attachmentName: string = "";
    imageNameTooltip:string = "";
    @ViewChild('imageName') imageName: ElementRef;

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
      let imageNameElement: HTMLDivElement = this.imageName.nativeElement;
      if (imageNameElement.scrollWidth > imageNameElement.clientWidth) {
        this.imageNameTooltip = this.getAttachmentName();
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