import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, OnDestroy, Output, Renderer2, SimpleChanges } from '@angular/core';
import ImageViewer from 'iv-viewer';
import {FullScreenViewer} from 'iv-viewer';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer-component.html',
  styleUrls: ['./image-viewer-component.scss']
})

export class ImageViewerComponent implements OnDestroy, OnInit, AfterViewInit {

    displayCustom: boolean = true;
    
    BASE_64_IMAGE = 'data:image/png;base64,';
    BASE_64_PNG = `${this.BASE_64_IMAGE} `;
    ROTATE_BY_90_DEGREES = 90;

    @Input() images: any[];
    @Input() showViewer = false;
    @Output() showViewerChange:EventEmitter<boolean> = new EventEmitter();

    idContainer:string = "idOnHTML";    
    viewerFullscreen;
    viewer;
    wrapper;
    curSpan;
    totalImages: number;
    imageRotation: number;
    isImageVertical: boolean; 
    showOnlyPDF = false;
    menuAutoHideTimer:any = null;

    _activeIndex: number = 0; 
    containerMode:boolean = true;

    actions: MenuItem[];
    //
    // function   : set up image view more actions menu
    //
    // parameters : renderer - custom.alternative DOM renderer
    //
    // returns    : none.
    // 
    constructor(private renderer: Renderer2) {
        //pop-up menu items
        this.actions = [
        {
            id: 'openInNewTab', 
            label: 'Open in new tab', 
            icon: 'pi pi-clone', 
            disabled : false,
            command: (event) => {
                this.option("openInNewTab");
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
    // function   : thumbnail action menu request event handler
    //
    // parameters : action - thumbnail action requested
    //
    // returns    : none.
    //       
    thumbnailAction(action) {
        switch (action) {
            case "rotateLeft":
                this.rotateLeft();
                break;
            case "zoomOut":
                this.zoomOut();
                break;
            case "fit2Screen":
                this.resetZoom();
                break;
            case "zoomIn":
                this.zoomIn();
                break;
            case "rotateRight":
                this.rotateRight();                
                break;
        }
    }

    //
    // function   : options toolbar click handler
    //
    // parameters : none.
    //
    // returns    : none.
    // 
    option(action) {
        switch (action) {
            case "download":

                break;
            case "openInNewTab":
                window.open(this.images[this._activeIndex], "_blank");
                break;
            case "close":
                this.showViewer = false;
                this.showViewerChange.emit(false);
                break;
        }
    }

    //
    // function   : thumbnail active index getter, used in combination 
    //              with setter to update image viewer then thumbnail changes
    //
    // parameters : none.
    //
    // returns    : thumbnail active index
    // 
    get activeIndex(): number {
        return this._activeIndex;
    }

    //
    // function   : thumbnail active index setter, used to update image
    //              view with new thumbnail selection
    //
    // parameters : newValue - new thumbnail selection index
    //
    // returns    : none.
    // 
    set activeIndex(newValue) {
        if (this.images && 0 <= newValue && newValue <= (this.images.length - 1)) {  
            this._activeIndex = newValue;
            this.nextImage(this._activeIndex);
        }
    } 

    //
    // function   : select next thumbnail
    //
    // parameters : none.
    //
    // returns    : none.
    // 
    next() {
        this.activeIndex = this.activeIndex + 1;
    }

    //
    // function   : select previous thumbnail
    //
    // parameters : none.
    //
    // returns    : none.
    // 
    previous() {
        this.activeIndex = this.activeIndex - 1;
    }

    //
    // function   : select new thumbnail image. This is called in 
    //              response to a user clicking on a thumbnail image
    //
    // parameters : index - new thumbnail image selection
    //
    // returns    : none.
    //     
    selection(index) {
        this.activeIndex = index;
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
        if (this.viewer) {
            this.viewer = this.viewer.destroy(); 
        }
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
        if (this.showViewer) {
            this.initialiseImageViewer();
            setTimeout(() => {
                this.showImage();
            }, 1000);
        }
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
        if (changes["showViewer"]) {
            if (changes["showViewer"].currentValue===true && 
                changes["showViewer"].previousValue===false && 
                this.images && 
                this.images.length > 0) {

                this.initialiseImageViewer();
                setTimeout(() => {
                    this.showImage();
                }, 1000);
            } else if (changes["showViewer"].currentValue===false && 
                       changes["showViewer"].previousValue===true ) {
                
                this.closeViewer();
            }
        }
    }

    //
    // function   : zoom in image displayed in viewer by 10%
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    zoomIn() {
        let zoomPercent = this.viewer._state.zoomValue + 50;
        if (zoomPercent > 500) {
            zoomPercent = 500;
        }
        this.viewer.zoom(zoomPercent);
    }

    //
    // function   : zoom out image displayed in viewer by 10%
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    zoomOut() {
        let zoomPercent = this.viewer._state.zoomValue - 50;        
        if (zoomPercent < 100) {
            zoomPercent = 100;
        }
        this.viewer.zoom(zoomPercent);
    }

    //
    // function   : create image viewer and insert it into DOM
    //
    // parameters : none.
    //
    // returns    : none.
    // 
    initialiseImageViewer() {
        this.imageRotation = 0;
        this.totalImages = this.images.length;
        //only initilaise viewer once
        if (!this.viewer) {
            if (this.containerMode) {
                this.wrapper = document.getElementById(`${this.idContainer}`);
                if (this.wrapper) {
                    this.curSpan = this.wrapper.querySelector('#current');
                    this.viewer = new ImageViewer(this.wrapper.querySelector('.image-container'));
                }
            } else {
                this.viewer = new FullScreenViewer();
            }
        }
    }

    //
    // function   : create image viewer and insert it into DOM
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    showImage() {
        if (this.containerMode) {
            //only needed for container mode
            this.resetImageViewer();
        }
        let imgObj = this.BASE_64_PNG;
        if (this.isPDF()) {
            this.loadPdfViewer();

        } else if (this.isImageUrl()) {
            imgObj = this.getImageSrc();

        } else {
            imgObj = this.getImageSrc();            
            //imgObj = this.BASE_64_PNG + this.getImageSrc();
        }
        if (this.containerMode) {
            //container mode
            this.viewer.load(imgObj);
        } else {
            //full screen mode
            this.viewer.show(imgObj);
        }
    }

    //
    // function   : load pdf viewer 
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    loadPdfViewer() {
        this.hideImageViewerButtons();
        const {widthIframe, heightIframe} = this.getIframeSize();
        this.injectIframe(widthIframe, heightIframe);
    }

    //
    // function   : create iframe to contain pdf viewer and insert into custom render
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    injectIframe(widthIframe: number, heightIframe: number) {
        const ivImageWrap = document.getElementById(this.idContainer).getElementsByClassName('iv-image-wrap').item(0);
        const iframe = document.createElement('iframe');

        iframe.id = this.getIdIframe();
        iframe.style.width = `${widthIframe}px`;
        iframe.style.height = `${heightIframe}px`;
        iframe.src = `${this.converterPDFBase64ParaBlob()}`;

        this.renderer.appendChild(ivImageWrap, iframe);
    }

    getIframeSize() {
        const container = document.getElementById(this.idContainer);
        const widthIframe = container.offsetWidth;
        const heightIframe = container.offsetHeight;
        return {widthIframe, heightIframe};
    }

    hideImageViewerButtons() {
        this.setStyleClass('iv-loader', 'visibility', 'hidden');
        this.setStyleClass('options-image-viewer', 'visibility', 'hidden');
    }

    isPDF() {
        return this.getImageSrc().startsWith('JVBE') || this.getImageSrc().startsWith('0M8R');
    }

    isImageUrl() {
        return this.getImageSrc().match(new RegExp(/^(https|http|www\.)/g));
    }

    resetImageViewer() {
        this.imageRotation = 0;
        const container = document.getElementById(this.idContainer);
        const iframeElement = document.getElementById(this.getIdIframe());
        const ivLargeImage = document.getElementById(this.idContainer).getElementsByClassName("iv-image").item(0);

        if (iframeElement) {
            this.renderer.removeChild(container, iframeElement);
            if (ivLargeImage) {
                this.renderer.removeChild(container, ivLargeImage);
            }
        }
        this.setStyleClass('iv-loader', 'visibility', 'auto');
        this.setStyleClass('options-image-viewer', 'visibility', 'inherit');
    }

    nextImage(index:number) {
        //reset image rotation
        this.isImageVertical = false;
        if (!this.isPDF() && this.showOnlyPDF) {
            this.nextImage(index);
            return;
        }
        this.showImage();
    }

    previousImage(index:number) {
        this.isImageVertical = false;
        if (!this.isPDF() && this.showOnlyPDF) {
            this.previousImage(index);
            return;
        }
        this.showImage();
    }

    rotateRight() {
        const timeout = this.resetZoom();
        setTimeout(() => {
            this.imageRotation += this.ROTATE_BY_90_DEGREES;
            this.isImageVertical = !this.isImageVertical;
            this.updateRotation();
        }, timeout);
    }

    rotateLeft() {
        const timeout = this.resetZoom();
        setTimeout(() => {
            this.imageRotation -= this.ROTATE_BY_90_DEGREES;
            this.isImageVertical = !this.isImageVertical;
            this.updateRotation();
        }, timeout);
    }

    resetZoom(): number {
        this.viewer.zoom(100);
        let timeout = 800;
        if (this.viewer._state.zoomValue === 100) {
            timeout = 0;
        }
        return timeout;
    }

    updateRotation(animate = true) {
        let scale = '';
        if (this.isImageVertical && this.isImageOverlappingInVertical()) {
            scale = `scale(${this.getScale()})`;
        }
        const newRoation = `rotate(${this.imageRotation}deg)`;
        this.uploadImage(newRoation, scale, animate);
    }

    getScale() {

        const containerElement = document.getElementById(this.idContainer);
        const ivLargeImageElement = document.getElementById(this.idContainer).getElementsByClassName("iv-image").item(0);
        const diferencaTamanhoImagem = ivLargeImageElement.clientWidth - containerElement.clientHeight;

        if (diferencaTamanhoImagem >= 250 && diferencaTamanhoImagem < 300) {
            return (ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight) - 0.1;
        } else if (diferencaTamanhoImagem >= 300 && diferencaTamanhoImagem < 400) {
            return ((ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight)) - 0.15;
        } else if (diferencaTamanhoImagem >= 400) {
            return ((ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight)) - 0.32;
        }
        return 0.6;
    }

    isImageOverlappingInVertical() {
        const marginError = 5;
        const containerElement: Element = document.getElementById(this.idContainer);
        const ivLargeImageElement: Element = document.getElementById(this.idContainer).getElementsByClassName("iv-image").item(0);
        return containerElement.clientHeight < ivLargeImageElement.clientWidth + marginError;
    }

    uploadImage(newRotation: string, scale: string, animated = true) {
        if (animated) {
            this.addAnimation('iv-snap-image');
            this.addAnimation("iv-image");
        }
        this.addRotation('iv-snap-image', newRotation, scale);
        this.addRotation("iv-image", newRotation, scale);

        setTimeout(() => {
            if (animated) {
                this.removeAnimation('iv-snap-image');
                this.removeAnimation("iv-image");
            }
        }, 501);
    }

    removeAnimation(componente: string) {
        this.setStyleClass(componente, 'transition', 'auto');
    }

    addRotation(componente: string, novaRotacao: string, scale: string) {
        this.setStyleClass(componente, 'transform', `${novaRotacao} ${scale}`);
    }

    addAnimation(componente: string) {
        this.setStyleClass(componente, 'transition', `0.5s linear`);
    }

    mostrarFullscreen() {
        const timeout = this.resetZoom();
        setTimeout(() => {

            this.viewerFullscreen = new FullScreenViewer();
            let imgSrc;

            if (this.isImageUrl()) {
                imgSrc = this.getImageSrc();
            } else {

                imgSrc = this.BASE_64_PNG + this.getImageSrc();
            }
            this.viewerFullscreen.show(imgSrc, imgSrc);
            this.updateRotation(false);
        }, timeout);
    }

    converterPDFBase64ParaBlob() {
        const arrBuffer = this.base64ToArrayBuffer(this.getImageSrc());
        const newBlob = new Blob([arrBuffer], { type: 'application/pdf' });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        return window.URL.createObjectURL(newBlob);
    }

    private getImageSrc() {
        return this.images[this._activeIndex];
    }

    base64ToArrayBuffer(data) {
        const binaryString = window.atob(data);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
            const ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    showPDFOnly() {
        this.showOnlyPDF = !this.showOnlyPDF;
        //this.proximaImagem();
    }

    setStyleClass(nomeClasse: string, nomeStyle: string, cor: string) {
        let cont;
        const listaElementos = document.getElementById(this.idContainer).getElementsByClassName(nomeClasse);
        for (cont = 0; cont < listaElementos.length; cont++) {
            this.renderer.setStyle(listaElementos.item(cont), nomeStyle, cor);
        }
    }

    getIdIframe() {
        return this.idContainer + '-iframe'
    }
}