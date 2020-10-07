import { EventEmitter, Input, ViewChild, ElementRef, Component, OnInit, AfterViewInit, Output } from '@angular/core';
import { ChatMessageAttachment } from './chat-message-attachment';

@Component({
    selector: 'app-chat-message-attachment-multi-image',
    templateUrl: './chat-message-attachment-multi-image-component.html',
    styleUrls: ['./chat-message-attachment-multi-image-component.scss']
  })

export class ChatMessageAttachmentMultiImageComponent implements OnInit, AfterViewInit {
    
  readonly attachmentType:string = "multi-image";

    imageCountTooltip:string = "";
    @ViewChild('imageName') imageName: ElementRef;

    @Input()
    images: ChatMessageAttachment[];

    @Input() 
    showBorder: boolean = false;

    @Output()
    showImageViewer = new EventEmitter<any>();

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
        this.imageCountTooltip = this.images.length + " images";
      }
    }
}