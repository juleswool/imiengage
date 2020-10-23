import { Component, AfterContentInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail-component.html',
  styleUrls: ['./thumbnail-component.scss']
})

export class ThumbnailComponent implements AfterContentInit {

  @ViewChild("slides") slidesContainer: ElementRef;

  @Input() images; 

  @Input() index:number;
  @Output() indexChange:EventEmitter<number> = new EventEmitter();

  @Output() click:EventEmitter<string> = new EventEmitter();

  public slidesIndex = 0;
  itemWidth = 0;
  sliderWidth:string = "";

  shownImageCount:number = 0;
  imageVisibleCount:number = 0;


  ngAfterContentInit() {
    //find the item width
    this.itemWidth = 112;
    this.setSliderWidth();

    window.addEventListener('resize', ()=> {
      this.setSliderWidth();
    });

  }

  setSliderWidth() {
    let maxViewable:number = Math.floor( window.innerWidth * 0.8  / this.itemWidth );
    let newImageVisibleCount:number = this.images.length > maxViewable ? maxViewable : this.images.length;

    if (newImageVisibleCount !== this.imageVisibleCount) {
      this.imageVisibleCount = newImageVisibleCount;
      this.sliderWidth = (this.imageVisibleCount * this.itemWidth).toString() + "px";
      setTimeout(()=> {
        this.refreshViewPort();
      },100);

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["index"]) {
        this.select(changes["index"].currentValue, false);
    }
  }

  ngAfterViewInit() {
  }

  refreshViewPort() {
    if (this.slidesContainer) {
      this.slidesContainer.nativeElement.scrollLeft = ( this.slidesIndex - Math.floor(this.imageVisibleCount / 2) ) * this.itemWidth;
    }
  }
  
  onClickLeft() {
    if (this.slidesIndex > 0) {
      this.slidesIndex--;
    } 
    this.refreshViewPort();
    this.indexChange.emit(this.slidesIndex);    
  }

  onClickRight() {
    if (this.slidesIndex < this.images.length - 1) {
      this.slidesIndex++
    }
    this.refreshViewPort();    
    this.indexChange.emit(this.slidesIndex);    
  }

  select(index, emitEvent:boolean = true) {
    this.slidesIndex=index;
    this.refreshViewPort();
    if (emitEvent) {
      this.indexChange.emit(this.slidesIndex);    
    }
  }

  getFilename(path:string) {
    let parts:string[] = path.split('/');
    return (parts[parts.length-1]);
  }
}

