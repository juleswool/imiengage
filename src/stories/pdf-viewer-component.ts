import { AfterViewInit, ViewChild, Component, EventEmitter, Input, OnInit, OnDestroy, Output, SimpleChanges, NgZone } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PDFProgressData, PdfViewerComponent, PDFDocumentProxy, PDFSource, } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer-component.html',
  styleUrls: ['./pdf-viewer-component.scss']
})

export class PdfDocumentComponent implements OnDestroy, OnInit, AfterViewInit {

    @Input() pdfSrc: string | PDFSource | ArrayBuffer;

    @Input() showViewer = false;
    @Output() showViewerChange:EventEmitter<boolean> = new EventEmitter();

    totalImages: number;
    menuAutoHideTimer:any = null;

    actions: MenuItem[];

    error: any;
    page = "1";
    rotation = 0;
    zoom = 1.0;
    originalSize = true;
    pdf: any;
    renderText = true;
    progressData: PDFProgressData;
    isLoaded = false;
    stickToPage = false;
    showAll = true;
    autoresize = true;
    fitToPage = false;
    outline: any[];
    isOutlineShown = false;
    pdfQuery = '';

    @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;

    click(action) {
        switch (action) {
            case "rotateLeft":
                this.rotate(-90);
                break;

            case "zoomOut":
                this.incrementZoom(-0.2);
                break;

            case "fit2Screen":
                this.resetZoom();                
                break;

            case "zoomIn":
                this.incrementZoom(0.2);
                break;

            case "rotateRight":
                this.rotate(90);                
                break;

            case "openInNewTab":
                window.open(this.pdfSrc as string, "_blank");
                break;      
              
            case "close":
                this.showViewer = false;
                this.showViewerChange.emit(false);
                break;              
        }
    }


    //
    // function   : set up image view more actions menu
    //
    // parameters : renderer - custom.alternative DOM renderer
    //
    // returns    : none.
    // 
    constructor(private ngZone: NgZone) {
        //pop-up menu items
        this.actions = [
        {
            id: 'openInNewTab', 
            label: 'Open in new tab', 
            icon: 'pi pi-clone', 
            disabled : false,
            command: (event) => {
                this.click("openInNewTab");
            }
        }, 
        ];
    }

    //
    // function   : show image actions quick menu
    //
    // parameters : menu  - reference to pop quick menu
    //              event - DOM event
    //
    // returns    : none.
    //
    showMenu(menu, event) {
        menu.show(event);
    }

    //
    // function   : start delay auto close actions menu, started when
    //              cusros is moved away from more actions button
    //
    // parameters : menu  - reference to action primeng menu
    //
    // returns    : none.
    //    
    startDelayClose(menu) {
        this.menuAutoHideTimer = setTimeout(()=> {
          menu.hide();  
          this.menuAutoHideTimer = null;
        },100);
    }

    //
    // function   : stop actions menu auto close as a result
    //              of the cursor moving into the actions menu
    //
    // parameters : none.
    //
    // returns    : none.
    //    
    stopDelayClose() {
        //stop delay close timer if active
        if (this.menuAutoHideTimer) {
            clearTimeout(this.menuAutoHideTimer);
            this.menuAutoHideTimer = null;      
        }
    }

    //
    // function   : component destroy event handler. Need to
    //              make sure all resources are cleaned up
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    ngOnDestroy() { 
        this.closeViewer();
    }

    //
    // function   : close image viewer, this will delete the image viewer and
    //              unbind all events handlers
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    closeViewer() {

    }

    //
    // function   : class initialised event handler
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    ngOnInit() {
    }

    //
    // function   : called once the view and child views have initialised,
    //              initialise image viewer and show the initial selected 
    //              image
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    ngAfterViewInit() {

    }

    //
    // function   : component change event handler, monitors the show/hide
    //              request for this component from its parent
    //
    // parameters : none.
    //
    // returns    : none.
    //      
    ngOnChanges(changes: SimpleChanges) {

    }

    openLocalFile() {
        //jQuery('#file').trigger('click');
    }
    
    toggleOutline() {
      this.isOutlineShown = !this.isOutlineShown;
    }
    
    incrementPage(amount: number) {
      this.page += amount;
    }
  
    incrementZoom(amount: number) {
      //limit zoom range
      if ((this.zoom + amount <= 3) && (this.zoom + amount > 0.2)) {
        this.zoom += amount;
      }
    }
  
    resetZoom() {
      this.zoom = 1.0;
    }

    rotate(angle: number) {
      this.rotation += angle;
    }
    
    /**
     * Render PDF preview on selecting file
     */
    onFileSelected() {
      const $pdf: any = document.querySelector('#file');
  
      if (typeof FileReader !== 'undefined') {
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.pdfSrc = e.target.result;
        };
  
        reader.readAsArrayBuffer($pdf.files[0]);
      }
    }
  
    /**
     * Get pdf information after it's loaded
     * @param pdf
     */
    afterLoadComplete(pdf: PDFDocumentProxy) {
      this.ngZone.run(()=> {
        this.pdf = pdf;
        this.isLoaded = true;
        this.loadOutline();
      })      
    }
  
    /**
     * Get outline
     */
    loadOutline() {
      this.pdf.getOutline().then((outline: any[]) => {
        this.outline = outline;
      });
    }
  
    /**
     * Handle error callback
     *
     * @param error
     */
    onError(error: any) {
      this.error = error; // set error
  
      if (error.name === 'PasswordException') {
        const password = prompt(
          'This document is password protected. Enter the password:'
        );
  
        if (password) {
          this.error = null;
          this.setPassword(password);
        }
      }
    }
    
    setPassword(password: string) {
      let newSrc;
      if (this.pdfSrc instanceof ArrayBuffer) {
        newSrc = { data: this.pdfSrc };
      } else if (typeof this.pdfSrc === 'string') {
        newSrc = { url: this.pdfSrc };
      } else {
        newSrc = { ...this.pdfSrc };
      }
      newSrc.password = password;
      this.pdfSrc = newSrc;
    }
  
    /**
     * Pdf loading progress callback
     * @param {PDFProgressData} progressData
     */
    onProgress(progressData: PDFProgressData) {
      console.log(progressData);
      this.progressData = progressData;
      this.isLoaded = false;
      this.error = null; // clear error
    }
  
    getInt(value: number): number {
      return Math.round(value);
    }
  
    /**
     * Navigate to destination
     * @param destination
     */
    navigateTo(destination: any) {
      this.pdfComponent.pdfLinkService.navigateTo(destination);
    }
  
    /**
     * Scroll view
     */
    scrollToPage() {
      this.pdfComponent.pdfViewer.scrollPageIntoView({
        pageNumber: 3,
      });
    }
    
    /**
     * Page rendered callback, which is called when a page is rendered (called multiple times)
     *
     * @param {CustomEvent} e
     */
    pageRendered(e: CustomEvent) {
      console.log('(page-rendered)', e);
    }
  
    currentPreviewPage(e: number) {
      //not sure why event is outside if angular zone, so change 
      //detection not working correctly, have to explicitly run inside zone
      this.ngZone.run(()=> {
        this.page = e.toString();      
      })
    }

    searchQueryChanged(newQuery: string) {
      if (newQuery !== this.pdfQuery) {
        this.pdfQuery = newQuery;
        this.pdfComponent.pdfFindController.executeCommand('find', {
          query: this.pdfQuery,
          highlightAll: true,
        });
      } else {
        this.pdfComponent.pdfFindController.executeCommand('findagain', {
          query: this.pdfQuery,
          highlightAll: true,
        });
      }
    }    

}