import { AfterViewInit, ComponentRef, Component, ViewChild, Injector, ReflectiveInjector, ComponentFactoryResolver, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges, NgZone } from '@angular/core';
import { formatDate } from '@angular/common';

import { AttachmentDirective } from './chat-message-attachment-directive';
import { ChatMessageAttachmentImageComponent } from './chat-message-attachment-image-component';
import { ChatMessageAttachmentPdfComponent } from './chat-message-attachment-pdf-component';
import { ChatMessageAttachmentMultiImageComponent } from './chat-message-attachment-multi-image-component';
import { ChatMessageAttachment } from './chat-message-attachment'

@Component({
    selector: 'app-chat-message',
    templateUrl: './chat-message-component.html',
    styleUrls: ['./chat-message-component.scss']
  })

  export class ChatMessageComponent implements OnInit, AfterViewInit, OnDestroy {

    //reference the underlying attachment component object
    @ViewChild(AttachmentDirective, {static: true}) attachmentHost: AttachmentDirective;

    //this is our array of attachment components components
    attachmentComponentRefs = <ComponentRef<any>>{};
    injector: Injector = null;  
    numAttachments: number = 0;
    chatMessageMsgTextClass: string = "";
    chatMessageClass: string = "chat-message-default-width";
    /**
     * control inputs
     */
    @Input()
    myobj: object = {};

    @Input()
    name: string = "james"; 

    @Input()
    message: string = "";

    @Input()
    type : 'customer' | 'agent' | 'auto' = 'customer';

    @Input()
    status : 'sending' | 'sent' | 'delivered' | 'seen' | 'failed';

    @Input()
    attachments: ChatMessageAttachment[];

    @Output()
    onRetry = new EventEmitter<any>();

    @Output()
    showImageViewer = new EventEmitter<any>();

    initial: string = "";
    chatMessageMsgClass:string = "";
    chatMessageNameRightClass: string ="";
    chatMessageStatusPositionClass: string = "";
    chatMessageStatusMessageClass: string = "";    
    statusMessage: string = "";
    stateStartDate: string;
    timeInStateDisplay: string = "Now";
    timeInStateCount: number = 0;
    timeInStateTimer: any = null;

    constructor(private ngZone: NgZone, private componentFactoryResolver: ComponentFactoryResolver) {
    }

    //
    // function   : monitor for property changes
    //
    // parameters : changes - property change object
    //
    // returns    : none.
    //    
    ngOnChanges (changes: SimpleChanges) {
      for (const propName in changes) {
        switch (propName) {

          case "name":
            this.initial = changes[propName].currentValue ? changes[propName].currentValue[0].toUpperCase() : "";            
            break;

          case "status":
            //only refresh if not customer message
            if (this.type!=='customer') {
              this.restartTimer();
              this.refreshStatusMessage(this.type, changes[propName].currentValue);
              this.refreshChatMessageMsgClass(this.type, changes[propName].currentValue);                        
            }
            break;

          case "type":
            this.restartTimer();
            switch(changes[propName].currentValue) {
              case "customer":
                this.initial = this.name ? this.name[0].toUpperCase() : "";
                this.chatMessageStatusPositionClass  = "chat-message-status-left";
                break;
              case "agent":
                this.initial = this.name ? this.name[0].toUpperCase() : "";
                this.chatMessageStatusPositionClass = "chat-message-status-right";
                break;
              case "auto":
                this.initial = "A";
                this.chatMessageStatusPositionClass = "chat-message-status-right";
                break;
            }
            this.refreshStatusMessage(changes[propName].currentValue, this.status);
            this.refreshChatMessageMsgClass(changes[propName].currentValue, this.status);            
            break;
        }
      }
    }

    refreshChatMessageMsgClass(type, status) {
      switch (type) {
        case "customer":
          this.chatMessageMsgClass = "chat-message-msg-customer";          
          break;
        case "agent":
          this.chatMessageMsgClass = status === "failed" ? "chat-message-msg-agent-failed" : "chat-message-msg-agent";
          this.chatMessageNameRightClass = status === "failed" ? "chat-message-name-agent-failed" : "chat-message-name-agent";          
          break;
        case "auto":   
          this.chatMessageMsgClass = status === "failed" ? "chat-message-msg-auto-failed" : "chat-message-msg-auto";
          this.chatMessageNameRightClass = status === "failed" ? "chat-message-name-auto-failed" : "chat-message-name-auto";                          
          break;
      }
    }

    refreshTimeInStateDisplay() {
      if (this.timeInStateCount === 0) {
        this.timeInStateDisplay = "Now";
      } else if (this.timeInStateCount < 60) {
        this.timeInStateDisplay = this.timeInStateCount + "s ago";
      } else {
        this.timeInStateDisplay = Math.floor(this.timeInStateCount/60).toString() + "m ago";        
      }
    }

    refreshStatusMessage(type, status) {
      //reset time in state
      this.stateStartDate = formatDate(new Date(), "MMM d, y 'at' h:mma", 'en');
      this.timeInStateCount = 0;
      this.refreshTimeInStateDisplay();

      if (type==="customer") {
        this.statusMessage = "";
      } else {
        switch (status) {
          case "sending":
            this.chatMessageStatusMessageClass = "chat-message-status-message-sending";
            this.statusMessage = "Sending...";
            break;
          case "sent":
            this.chatMessageStatusMessageClass = "chat-message-status-message-sent";            
            this.statusMessage = "Sent";
            break;
          case "delivered":
            this.chatMessageStatusMessageClass = "chat-message-status-message-delivered";            
            this.statusMessage = "Delivered";
            break;
          case "seen":
            this.chatMessageStatusMessageClass = "chat-message-status-message-seen";            
            this.statusMessage = "Seen";
            break;
          case "failed":
            this.chatMessageStatusMessageClass = "chat-message-status-message-failed";            
            this.statusMessage = "Failed to send. Click to retry";                  
            break;
        }
      }    
    }

    statusMessageClick() {
      //only valid in failed state
      if (this.status==='failed') {
        this.onRetry.emit({});
      }
    }

    removeAllAttachment() {
      let i:number = 0;      
      //delete current attactments, unsubscribe any event handlers
      let componentRefCount:number = Object.keys(this.attachmentComponentRefs).length;
      for (i=0; i < componentRefCount; i++) {
        switch (this.attachmentComponentRefs[i].instance.attachmentType) {
          case "multi-image":
            (this.attachmentComponentRefs[i].instance as ChatMessageAttachmentMultiImageComponent).showImageViewer.unsubscribe();
            break;
          case "image":
          case "pdf":
            break;
        }
      }
      this.attachmentHost.viewContainerRef.clear();
      this.attachmentComponentRefs = <ComponentRef<any>>{};

      //reset attachment count
      this.numAttachments = 0;      
    }

    alreadyExist(currentAttachments, newUrl) {
      let exists = false;
      for (let i=0; i < currentAttachments.length; i++) {
        if (currentAttachments.url===newUrl) {
          exists = true;
          break;
        }
      }
      return (exists);
    }

    showAttachments(attachments:ChatMessageAttachment[]) {
      let i:number = 0;
     
      //as we are creating the component dynamically we have to 
      //inject the service object each time we create a new task component
      /*
      this.injector = ReflectiveInjector.resolveAndCreate(
        [{
          provide: 'rostrvmService', 
          useValue: this.rostrvmService
        }]);      
      */

      //monitor for changes in task list
      let componentFactory, imageAttachments:ChatMessageAttachment[] = [];
   
      //in the case of images attachment, 3 and less are shown individually, more
      //than 3 are shown as a group and link to carousel viewer
      for (i = attachments.length - 1; i >= 0; i--) {
        let parts = this.attachments[i].url.split('.');

        //user either the mime type or file extension to workout the attchment type
        switch (this.attachments[i].mimeType || parts[parts.length-1]) { 
          case "image/png":
          case "png":
          case "image/jpeg":
          case "jpeg":
          case "image/bmp":
          case "bmp":
              imageAttachments.push({ 
                "url": attachments[i].url,
                "size": attachments[i].size,
                "mimeType": attachments[i].mimeType, 
              })
              break;
        }
      }

      //more than 3 images?
      if (imageAttachments.length > 3) {
        //create image group attachment
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChatMessageAttachmentMultiImageComponent);
        const componentRef = this.attachmentHost.viewContainerRef.createComponent(componentFactory,0,this.injector);
        // add reference for newly created component
        this.attachmentComponentRefs[this.numAttachments++] = componentRef;
        //tell the component its attachment
        componentRef.instance['images'] = imageAttachments;
        //need to subscribe to show event viewer request
        (componentRef.instance as ChatMessageAttachmentMultiImageComponent).showImageViewer.subscribe((images) => {
          this.showImageViewer.emit(images);
        })
        //if there is only a single multi-image attachment then size message text width to image width
        if (attachments.length===imageAttachments.length) {
          this.chatMessageClass = "chat-message-image-width";
        }
      } 
      
      //process other attachments individually, including images if less than 3
      for (i = 0; i < attachments.length; i++) {
        let parts = attachments[i].url.split('.');
        componentFactory = null;
        
        switch (parts[parts.length-1]) {
          case "png":
          case "jpeg":
            //only process if 3 or less images  
            if (imageAttachments.length <= 3) {
              componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChatMessageAttachmentImageComponent);
              const componentRef = this.attachmentHost.viewContainerRef.createComponent(componentFactory,0,this.injector);
              // add reference for newly created component
              this.attachmentComponentRefs[this.numAttachments++] = componentRef;
              //tell the component its attachment
              componentRef.instance['attachment'] = attachments[i];
              //if there is only a single image attachment, size message text width to image width
              if (attachments.length===1) {
                this.chatMessageClass = "chat-message-image-width";
              }
              //if there is more than one individual attachment then show borders around them
              componentRef.instance['showBorder'] = 
                (imageAttachments.length===2) || 
                (imageAttachments.length===3) ||
                attachments.length > imageAttachments.length;
            }
            break;

          case "pdf":
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChatMessageAttachmentPdfComponent);
            const componentRef = this.attachmentHost.viewContainerRef.createComponent(componentFactory,0,this.injector);
            // add reference for newly created component
            this.attachmentComponentRefs[this.numAttachments++] = componentRef;
            //tell the component its attachment
            componentRef.instance['attachment'] = this.attachments[i];            
            componentRef.instance['showBorder'] = this.message!=='';
            break;
        }
      }
    }

    restartTimer() {
      this.stopTimer();
      this.startTimer();
    }

    startTimer() {
      //make sure time runs inside zone so angular 
      //angular change detection works and the UI is refreshed
      this.ngZone.run(()=> {
        this.timeInStateTimer = setInterval(() => {   
          this.timeInStateCount++;
          this.refreshTimeInStateDisplay();
        }, 1000);
      }) 
    }

    stopTimer() {
      if (this.timeInStateTimer) {
        clearInterval(this.timeInStateTimer);
        this.timeInStateTimer = null;
      }
    }

    //
    // function   : component initialisation event handler
    //
    // parameters : none.
    //
    // returns    : none.
    //    
    ngOnInit() {
      //do we have any attachments?
      if (this.attachments) {
        this.showAttachments(this.attachments);
      }      
    }

    //
    // function   : called as the component is being destroyed. Clean-up
    //              any subscription and event handler bindings
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    ngOnDestroy() {
      //make sure timer is stopped
      this.stopTimer();
      this.removeAllAttachment();
    }

    ngAfterViewInit() {
      //determine the attachment padding if no message is present
      if (this.message==='') {
        if (this.attachments && (this.attachments[0].url.indexOf(".pdf") < 0)) {
          this.chatMessageMsgTextClass = "chat-message-msg-no-text";
        }
      } else {
        this.chatMessageMsgTextClass = "chat-message-msg-text";
      }
    }
}