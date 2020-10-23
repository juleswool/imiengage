import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';

import ImageViewer from 'iv-viewer';
import {FullScreenViewer} from 'iv-viewer';

/**
* @author Breno Prata - 22/12/2017
*/
@Component({

  selector: 'app-image-viewer',

  templateUrl: './image-viewer-component.html',

  styleUrls: ['./image-viewer-component.scss']
})
export class ImageViewerComponent implements OnChanges, OnInit, AfterViewInit {

    responsiveOptions:any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];


    images1: any[] = [
        {
            "previewImageSrc": "https://picsum.photos/id/1025/4951/3301",
            "thumbnailImageSrc": "https://picsum.photos/id/1025/160/120",
            "alt": "Description for Image 1",
            "title": "Title 1"
        },
        {
            "previewImageSrc": "https://picsum.photos/id/1024/1920/1280",
            "thumbnailImageSrc": "https://picsum.photos/id/1024/160/120",
            "alt": "Description for Image 2",
            "title": "Title 2"
        },
        {
            "previewImageSrc": "https://picsum.photos/id/1020/4288/2848",
            "thumbnailImageSrc": "https://picsum.photos/id/1020/160/120",
            "alt": "Description for Image 3",
            "title": "Title 3"
        },
        {
            "previewImageSrc": "https://picsum.photos/id/1018/3914/2935",
            "thumbnailImageSrc": "https://picsum.photos/id/1018/160/120",
            "alt": "Description for Image 4",
            "title": "Title 4"
        },
        {
            "previewImageSrc": "https://picsum.photos/id/1021/2048/1206",
            "thumbnailImageSrc": "https://picsum.photos/id/1021/160/120",
            "alt": "Description for Image 5",
            "title": "Title 5"
        },
        {
            "previewImageSrc": "https://picsum.photos/id/102/4320/3240",
            "thumbnailImageSrc": "https://picsum.photos/id/102/160/120",
            "alt": "Description for Image 6",
            "title": "Title 6"
        },
        {
            "previewImageSrc": "https://picsum.photos/id/1005/5760/3840",
            "thumbnailImageSrc": "https://picsum.photos/id/1005/160/120",
            "alt": "Description for Image 7",
            "title": "Title 7"
        },
        {
            "previewImageSrc": "https://picsum.photos/id/1012/3973/2639",
            "thumbnailImageSrc": "https://picsum.photos/id/1012/160/120",
            "alt": "Description for Image 8",
            "title": "Title 8"
        }        
    ]

    responsiveOptions2:any[] = [
        {
            breakpoint: '1500px',
            numVisible: 5
        },
        {
            breakpoint: '1024px',
            numVisible: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

  BASE_64_IMAGE = 'data:image/png;base64,';
  BASE_64_PNG = `${this.BASE_64_IMAGE} `;
  ROTACAO_PADRAO_GRAUS = 90;

  @Input() idContainer = "";
  @Input() images: any[];
  @Input() rotate = true;
  @Input() download = true;
  @Input() fullscreen = true;
  @Input() resetZoom = true;
  @Input() loadOnInit = false;
  @Input() showOptions = true;
  @Input() zoomInButton = true;
  @Input() zoomOutButton = true;

  @Input() showPDFOnlyOption = true;
  @Input() primaryColor = '#0176bd';
  @Input() buttonsColor = 'white';
  @Input() buttonsHover = '#333333';
  @Input() defaultDownloadName = 'Image';
  @Input() rotateRightTooltipLabel = 'Rotate right';
  @Input() rotateLeftTooltipLabel = 'Rotate left';
  @Input() resetZoomTooltipLabel = 'Reset zoom';
  @Input() fullscreenTooltipLabel = 'Fullscreen';
  @Input() zoomInTooltipLabel = 'Zoom In';
  @Input() zoomOutTooltipLabel = 'Zoom Out';
  @Input() downloadTooltipLabel = 'Download';
  @Input() showPDFOnlyLabel = 'Show only PDF';
  @Input() openInNewTabTooltipLabel = 'Open in new tab';
  @Input() enableTooltip = true;

  @Output() onNext = new EventEmitter();
  @Output() onPrevious = new EventEmitter();

  viewer;
  wrapper;
  curSpan;
  viewerFullscreen;
  totalImagens: number;
  indexImagemAtual: number;
  rotacaoImagemAtual: number;
  stringDownloadImagem: string;
  isImagemVertical: boolean;
  showOnlyPDF = false;

  zoomPercent = 100;

  constructor(private renderer: Renderer2) {}


  get activeIndex(): number {
    return this._activeIndex;
}

set activeIndex(newValue) {
    if (this.images1 && 0 <= newValue && newValue <= (this.images1.length - 1)) {
        this._activeIndex = newValue;
        this.proximaImagem(this._activeIndex);
    }
}

_activeIndex: number = 0;

next() {
    this.activeIndex++;
}

prev() {
    this.activeIndex--;
}

  ngOnInit() {
      if (this.loadOnInit) {
          this.isImagensPresentes();
      }
  }

  ngAfterViewInit() {
      this.inicializarCores();
      if (this.loadOnInit) {
          this.inicializarImageViewer();
          setTimeout(() => {
              this.showImage();
          }, 1000);
      }
  }

  private inicializarCores() {
      this.setStyleClass('inline-icon', 'background-color', this.primaryColor);
      this.setStyleClass('footer-info', 'background-color', this.primaryColor);
      this.setStyleClass('footer-icon', 'color', this.buttonsColor);
  }

  ngOnChanges(changes: SimpleChanges) {
      this.imagesChange(changes);
      this.primaryColorChange(changes);
      this.buttonsColorChange(changes);
      this.defaultDownloadNameChange(changes);
  }

  zoomIn() {
      this.zoomPercent += 10;
      this.viewer.zoom(this.zoomPercent);
  }

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

  primaryColorChange(changes: SimpleChanges) {
      if (changes['primaryColor'] || changes['showOptions']) {
          setTimeout(() => {
              this.setStyleClass('inline-icon', 'background-color', this.primaryColor);
              this.setStyleClass('footer-info', 'background-color', this.primaryColor);
          }, 350);
      }
  }

  buttonsColorChange(changes: SimpleChanges) {
      if (changes['buttonsColor'] || changes['rotate'] || changes['download']
      || changes['fullscreen']) {
          setTimeout(() => {

              this.setStyleClass('footer-icon', 'color', this.buttonsColor);
          }, 350);
      }
  }

  defaultDownloadNameChange(changes: SimpleChanges) {
      if (changes['defaultDownloadName']) {
          this.defaultDownloadName = this.defaultDownloadName;
      }
  }

  imagesChange(changes: SimpleChanges) {
      if (changes['images'] && this.isImagensPresentes()) {
          this.inicializarImageViewer();
          setTimeout(() => {
              this.showImage();
          }, 1000);
      }
  }

  isImagensPresentes() {
      return this.images1
          && this.images1.length > 0;
  }

  inicializarImageViewer() {

      this.indexImagemAtual = 0;
      this.rotacaoImagemAtual = 0;
      this.totalImagens = this.images1.length;

      if (this.viewer) {

          this.wrapper.querySelector('.total').innerHTML = this.totalImagens;
          return;
      }

      this.wrapper = document.getElementById(`${this.idContainer}`);

      if (this.wrapper) {
          this.curSpan = this.wrapper.querySelector('#current');
          this.viewer = new ImageViewer(this.wrapper.querySelector('.image-container'));
 //         this.wrapper.querySelector('.total').innerHTML = this.totalImagens;
      }
  }

  showImage() {
      this.prepararTrocaImagem();

      let imgObj = this.BASE_64_PNG;
      if (this.isPDF()) {

          this.carregarViewerPDF();
      } else if (this.isURlImagem()) {

          imgObj = this.getImagemAtual();
          this.stringDownloadImagem = this.getImagemAtual();
      } else {
          imgObj = this.BASE_64_PNG + this.getImagemAtual();
          this.stringDownloadImagem = this.BASE_64_IMAGE + this.getImagemAtual();
      }
      this.viewer.load(imgObj, imgObj);
      //this.curSpan.innerHTML = this.indexImagemAtual;
      this.inicializarCores();
  }

  carregarViewerPDF() {
      this.esconderBotoesImageViewer();
      const {widthIframe, heightIframe} = this.getTamanhoIframe();
      this.injetarIframe(widthIframe, heightIframe);
  }

  injetarIframe(widthIframe: number, heightIframe: number) {
      const ivImageWrap = document.getElementById(this.idContainer).getElementsByClassName('iv-image-wrap').item(0);

      const iframe = document.createElement('iframe');

      iframe.id = this.getIdIframe();
      iframe.style.width = `${widthIframe}px`;
      iframe.style.height = `${heightIframe}px`;
      iframe.src = `${this.converterPDFBase64ParaBlob()}`;

      this.renderer.appendChild(ivImageWrap, iframe);
  }

  getTamanhoIframe() {

      const container = document.getElementById(this.idContainer);

      const widthIframe = container.offsetWidth;
      const heightIframe = container.offsetHeight;
      return {widthIframe, heightIframe};
  }

  esconderBotoesImageViewer() {
      this.setStyleClass('iv-loader', 'visibility', 'hidden');
      this.setStyleClass('options-image-viewer', 'visibility', 'hidden');
  }

  isPDF() {
      return this.getImagemAtual().startsWith('JVBE') || this.getImagemAtual().startsWith('0M8R');
  }

  isURlImagem() {
      return this.getImagemAtual().match(new RegExp(/^(https|http|www\.)/g));
  }

  prepararTrocaImagem() {
      this.rotacaoImagemAtual = 0;
      this.limparCacheElementos();
  }

  limparCacheElementos() {

      const container = document.getElementById(this.idContainer);
      const iframeElement = document.getElementById(this.getIdIframe());
      const ivLargeImage = document.getElementById(this.idContainer).getElementsByClassName('iv-large-image').item(0);

      if (iframeElement) {

          this.renderer.removeChild(container, iframeElement);

          if (ivLargeImage) {

              this.renderer.removeChild(container, ivLargeImage);
          }
      }

      if (iframeElement) {
      }

      this.setStyleClass('iv-loader', 'visibility', 'auto');
      this.setStyleClass('options-image-viewer', 'visibility', 'inherit');
  }

  proximaImagem(index:number) {
      this.isImagemVertical = false;
      //this.indexImagemAtual++;
      this.indexImagemAtual=index;
      if (this.indexImagemAtual > this.totalImagens) {
          this.indexImagemAtual = 1;
      }
      this.onNext.emit(this.indexImagemAtual);
      if (!this.isPDF() && this.showOnlyPDF) {
          this.proximaImagem(index);
          return;
      }
      this.showImage();
  }

  imagemAnterior(index:number) {
      this.isImagemVertical = false;
      //this.indexImagemAtual--;
      this.indexImagemAtual--;      
      if (this.indexImagemAtual <= 0) {
          this.indexImagemAtual = this.totalImagens;
      }
      this.onPrevious.emit(this.indexImagemAtual);
      if (!this.isPDF() && this.showOnlyPDF) {
          this.imagemAnterior(index);
          return;
      }
      this.showImage();
  }

  rotacionarDireita() {
      const timeout = this.resetarZoom();
      setTimeout(() => {
          this.rotacaoImagemAtual += this.ROTACAO_PADRAO_GRAUS;
          this.isImagemVertical = !this.isImagemVertical;
          this.atualizarRotacao();
      }, timeout);
  }

  rotacionarEsquerda() {
      const timeout = this.resetarZoom();
      setTimeout(() => {
          this.rotacaoImagemAtual -= this.ROTACAO_PADRAO_GRAUS;
          this.isImagemVertical = !this.isImagemVertical;
          this.atualizarRotacao();
      }, timeout);
  }

  resetarZoom(): number {
      this.zoomPercent = 100;
      this.viewer.zoom(this.zoomPercent);
      let timeout = 800;
      if (this.viewer._state.zoomValue === this.zoomPercent) {
          timeout = 0;
      }
      return timeout;
  }

  atualizarRotacao(isAnimacao = true) {
      let scale = '';
      if (this.isImagemVertical && this.isImagemSobrepondoNaVertical()) {
          scale = `scale(${this.getScale()})`;
      }
      const novaRotacao = `rotate(${this.rotacaoImagemAtual}deg)`;
      this.carregarImagem(novaRotacao, scale, isAnimacao);
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

  isImagemSobrepondoNaVertical() {

      const margemErro = 5;
      const containerElement: Element = document.getElementById(this.idContainer);
      const ivLargeImageElement: Element = document.getElementById(this.idContainer).getElementsByClassName('iv-large-image').item(0);

      return containerElement.clientHeight < ivLargeImageElement.clientWidth + margemErro;
  }

  carregarImagem(novaRotacao: string, scale: string, isAnimacao = true) {
      if (isAnimacao) {
          this.adicionarAnimacao('iv-snap-image');
          this.adicionarAnimacao('iv-large-image');
      }
      this.adicionarRotacao('iv-snap-image', novaRotacao, scale);
      this.adicionarRotacao('iv-large-image', novaRotacao, scale);
      setTimeout(() => {
          if (isAnimacao) {
              this.retirarAnimacao('iv-snap-image');
              this.retirarAnimacao('iv-large-image');
          }
      }, 501);
  }

  retirarAnimacao(componente: string) {
      this.setStyleClass(componente, 'transition', 'auto');
  }

  adicionarRotacao(componente: string, novaRotacao: string, scale: string) {
      this.setStyleClass(componente, 'transform', `${novaRotacao} ${scale}`);
  }

  adicionarAnimacao(componente: string) {
      this.setStyleClass(componente, 'transition', `0.5s linear`);
  }

  mostrarFullscreen() {
      const timeout = this.resetarZoom();
      setTimeout(() => {

          this.viewerFullscreen = new FullScreenViewer();
          let imgSrc;

          if (this.isURlImagem()) {

              imgSrc = this.getImagemAtual();
          } else {

              imgSrc = this.BASE_64_PNG + this.getImagemAtual();
          }
          this.viewerFullscreen.show(imgSrc, imgSrc);
          this.atualizarRotacao(false);
      }, timeout);
  }

  converterPDFBase64ParaBlob() {

      const arrBuffer = this.base64ToArrayBuffer(this.getImagemAtual());

      const newBlob = new Blob([arrBuffer], { type: 'application/pdf' });

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
      }

      return window.URL.createObjectURL(newBlob);
  }

  private getImagemAtual() {
      return this.images1[this.indexImagemAtual].previewImageSrc;
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

  atualizarCorHoverIn(event: MouseEvent) {

      this.renderer.setStyle(event.srcElement, 'color', this.buttonsHover);
  }

  atualizarCorHoverOut(event: MouseEvent) {

      this.renderer.setStyle(event.srcElement, 'color', this.buttonsColor);
  }

  getIdIframe() {
      return this.idContainer + '-iframe'
  }
}