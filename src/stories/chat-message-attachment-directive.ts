// tslint:disable: directive-selector
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[attachmentHost]',
})
export class AttachmentDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
