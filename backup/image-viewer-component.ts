import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import ImageViewer from 'iv-viewer';
import { SliderComponent } from './slider-component';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer-component.html',
  styleUrls: ['./image-viewer-component.scss']
})

export class ImageViewerComponent implements OnInit, AfterViewInit {

    responsiveOptions:any[] = [
        { breakpoint: '1401px', numVisible: 5 },
        { breakpoint: '800px', numVisible: 4 },        
        { breakpoint: '500px', numVisible: 3 },
        { breakpoint: '400px',  numVisible: 2 },
        { breakpoint: '300px',  numVisible: 1 } 
    ];

    displayCustom: boolean = true;
    
    BASE_64_IMAGE = 'data:image/png;base64,';
    BASE_64_PNG = `${this.BASE_64_IMAGE} `;
    ROTATE_BY_90_DEGREES = 90;

    @Input() idContainer = "";
    @Input() images: any[];
    @Input() loadOnInit = false;

    viewer;
    wrapper;
    curSpan;
    totalImages: number;
    imageRotation: number;
    isImageVertical: boolean; 
    showOnlyPDF = false;
    //viewerWidth:string = (window.innerWidth * 0.5).toString() + "px";
    
    zoomPercent = 100;
    _activeIndex: number = 0; 
    //
    // function   : class constructor
    //
    // parameters : renderer - custom.alternative DOM renderer
    //
    // returns    : none.
    // 
    constructor(private renderer: Renderer2) {
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
    // function   : class initialised event handler
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    ngOnInit() {
        /*
        window.addEventListener('resize', ()=> {
            if (this.viewerWidth!==(window.innerWidth * 0.5).toString() + "px") {
                this.viewerWidth=(window.innerWidth * 0.5).toString() + "px";
                this.resetZoom();
            }
        });
        */
    }

    //
    // function   : called once the view and child views have initialised,
    //              initialise image viewer
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    ngAfterViewInit() {
        if (this.loadOnInit) {
            this.initialiseImageViewer();
            setTimeout(() => {
                this.showImage();
            }, 1000);
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
        this.zoomPercent += 10;
        this.viewer.zoom(this.zoomPercent);
    }

    //
    // function   : zoom out image displayed in viewer by 10%
    //
    // parameters : none.
    //
    // returns    : none.
    //     
    zoomOut() {
        if (this.zoomPercent === 100) {
            return;
        }
        this.zoomPercent -= 10;
        if (this.zoomPercent < 0) {
            this.zoomPercent = 0;
        }
        this.viewer.zoom(this.zoomPercent);
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
            this.wrapper = document.getElementById(`${this.idContainer}`);

            if (this.wrapper) {
                this.curSpan = this.wrapper.querySelector('#current');
                this.viewer = new ImageViewer(this.wrapper.querySelector('.image-container'));
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
        this.resetImageViewer();

        let imgObj = this.BASE_64_PNG;
        if (this.isPDF()) {
            this.loadPdfViewer();

        } else if (this.isImageUrl()) {
            imgObj = this.getImageSrc();

        } else {
            imgObj = this.BASE_64_PNG + this.getImageSrc();
        }
        this.viewer.load(imgObj, imgObj);
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
        const ivLargeImage = document.getElementById(this.idContainer).getElementsByClassName('iv-large-image').item(0);

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
        this.zoomPercent = 100;
        this.viewer.zoom(this.zoomPercent);
        let timeout = 800;
        if (this.viewer._state.zoomValue === this.zoomPercent) {
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
        const ivLargeImageElement = document.getElementById(this.idContainer).getElementsByClassName('iv-large-image').item(0);
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
        const ivLargeImageElement: Element = document.getElementById(this.idContainer).getElementsByClassName('iv-large-image').item(0);
        return containerElement.clientHeight < ivLargeImageElement.clientWidth + marginError;
    }

    uploadImage(newRotation: string, scale: string, animated = true) {
        if (animated) {
            this.addAnimation('iv-snap-image');
            this.addAnimation('iv-large-image');
        }
        this.addRotation('iv-snap-image', newRotation, scale);
        this.addRotation('iv-large-image', newRotation, scale);

        setTimeout(() => {
            if (animated) {
                this.removeAnimation('iv-snap-image');
                this.removeAnimation('iv-large-image');
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
        return this.images[this._activeIndex].previewImageSrc;
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