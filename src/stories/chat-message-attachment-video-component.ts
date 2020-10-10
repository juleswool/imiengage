import { Input, ViewChild, ElementRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { ChatMessageAttachment } from './chat-message-attachment';

@Component({
    selector: 'app-chat-message-attachment-video',
    templateUrl: './chat-message-attachment-video-component.html',
    styleUrls: ['./chat-message-attachment-video-component.scss']
  })

export class ChatMessageAttachmentVideoComponent implements OnInit, AfterViewInit {
    
    readonly attachmentType:string = "video";

    attachmentName: string = "";
    imageNameTooltip:string = "";
    @ViewChild('imageName') imageName: ElementRef;
    @ViewChild('video') video: ElementRef;

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
      //enable video controls
      let videoNativeElement:HTMLMediaElement = this.video.nativeElement;
      videoNativeElement.controls = true;
    }

    getAttachmentName() {
      if (!this.attachmentName) {
        let parts:string[] = this.attachment.url.split('/');
        this.attachmentName = parts[parts.length-1];
      }
      return (this.attachmentName);
    }
}