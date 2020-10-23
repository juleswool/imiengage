import { Component, AfterContentInit, ContentChildren, ViewChild, QueryList, ElementRef } from '@angular/core';
import { SliderItemDirective } from './slider-item-directive';

@Component({
  selector: 'app-slider',
  templateUrl: './slider-component.html',
  styleUrls: ['./slider-component.scss']
})
export class SliderComponent implements AfterContentInit {

  @ContentChildren(SliderItemDirective, { read: ElementRef }) items
    : QueryList<ElementRef<HTMLDivElement>>;

  @ViewChild('slides') slidesContainer: ElementRef<HTMLDivElement>;

  public slidesIndex = 0;
  itemWidth = 0;
  sliderWidth:string = "";

  shownImageCount:number = 0;
  imageVisibleCount:number = 0;

  get currentItem(): ElementRef<HTMLDivElement> {
    return this.items.find((item, index) => index === this.slidesIndex);
  }

  ngAfterContentInit() {
    console.log('items', this.items);
    //find the item width
    this.itemWidth = this.items.first.nativeElement.offsetWidth;
    this.setSliderWidth();

    window.addEventListener('resize', ()=> {
      this.setSliderWidth();
    });

  }

  setSliderWidth() {
    let maxViewable:number = Math.floor( window.innerWidth * 0.8  / this.itemWidth );
    let newImageVisibleCount:number = this.items.length > maxViewable ? maxViewable : this.items.length;

    if (newImageVisibleCount !== this.imageVisibleCount) {
      this.imageVisibleCount = newImageVisibleCount;
      this.sliderWidth = (this.imageVisibleCount * this.itemWidth).toString() + "px";
    }

  }

  ngAfterViewInit() {
    console.log('slides', this.slidesContainer);

  }

  onClickLeft() {
    this.slidesContainer.nativeElement.scrollLeft -= this.currentItem.nativeElement.offsetWidth;
    
    if (this.slidesIndex > 0) {
      this.slidesIndex--;
    } 
  }

  onClickRight() {
    this.slidesContainer.nativeElement.scrollLeft += this.currentItem.nativeElement.offsetWidth;

    if (this.slidesIndex < this.items.length - 1) {
      this.slidesIndex++
    }
  }

}