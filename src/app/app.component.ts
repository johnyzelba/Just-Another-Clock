import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, Renderer2, OnInit, ViewEncapsulation, ɵConsole } from '@angular/core';
import { DatePipe } from '@angular/common';
import *  as  numbersToArray from './numbersToArray.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,

})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('starGroup', { static: false }) starGroup: ElementRef;
  @ViewChild('cloudGroup', { static: false }) cloudGroup: ElementRef;
  @ViewChild('sky', { static: false }) sky: ElementRef;
  @ViewChild('box', { static: false }) box: ElementRef;

  boxParams = {
    showBox: false,
    width: 0,
    height: 0,
  };

  padding = {
    x: 1,
    y: 1
  };

  pixelParams = {
    width: 20,
    height: 20,
    opacity: 0.6
  };

  scalar: number = 1;
  numOfPixelsInRow: Array<any>;
  numOfRows: Array<any>;
  currentTime: Array<string>;
  currentHour: string;
  stars: any;
  clouds: any
  pixelClick: boolean = false;
  dayTime: String = 'night';

  constructor(private el: ElementRef, public cdRef: ChangeDetectorRef, public datepipe: DatePipe, private renderer: Renderer2, private elementRef: ElementRef) {
    this.currentTime = this.datepipe.transform(new Date(), 'hh:mm:ss').split("");
    this.currentHour = this.datepipe.transform(new Date(), 'H');
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    if (Number(this.currentHour) > 18 || Number(this.currentHour) < 6) {
      this.dayTime = 'night';
      this.createSky(this.starGroup);
    }
    else {
      this.dayTime = 'day';
      this.createSky(this.cloudGroup);
    }
    this.draPixels()
    this.drawTime()
    this.boxParams.showBox = true;
    this.cdRef.detectChanges();
  }

  draPixels() {
    this.numOfPixelsInRow = new Array((this.box.nativeElement.offsetWidth - (this.box.nativeElement.offsetWidth % this.pixelParams.width)) / this.pixelParams.width)
      .fill(0);
    this.numOfRows = new Array(((this.box.nativeElement.offsetHeight - (this.box.nativeElement.offsetHeight % this.pixelParams.height)) / this.pixelParams.height) - 4)
      .fill([])
      .map(u => {
        let tempArr = [];
        this.numOfPixelsInRow.forEach(pixel => {
          tempArr.push({
            width: this.pixelParams.width,
            height: this.pixelParams.height,
            opacity: this.pixelParams.opacity,
            pixelClick: false
          });
        });
        return tempArr;
      });
  }

  drawTime() {
    this.scalar = (this.numOfPixelsInRow.length - (this.numOfPixelsInRow.length % 40)) / 40;
    this.padding.x = ((this.numOfPixelsInRow.length - (40 * this.scalar)) - ((this.numOfPixelsInRow.length - (40 * this.scalar)) % 2));
    this.boxParams.height = (this.numOfPixelsInRow.length % 40) * 2 + (5 * this.scalar);
    this.padding.y = ((this.numOfRows.length - (5 * this.scalar)) - ((this.numOfRows.length - (5 * this.scalar)) % 2)) / 2;
    this.cdRef.detectChanges();
    setInterval(() => {
      let margerX = 0;
      for (let i = this.padding.y; i < 5 * this.scalar + this.padding.y; i++)
        for (let j = this.padding.x; j < 40 * this.scalar + this.padding.x; j++) {
          if (this.numOfRows[i][j])
            this.numOfRows[i][j].opacity = 0.6;
        }
      this.currentTime = this.datepipe.transform(new Date(), 'hh:mm:ss').split("");
      this.currentTime.forEach(numberChar => {
        if (numberChar == ':')
          numberChar = '10';
        numbersToArray.days[numberChar].fill.forEach(pixel => {
          for (let i = this.padding.y; i < this.scalar + this.padding.y; i++)
            for (let j = this.padding.x; j < this.scalar + this.padding.x; j++)
              this.numOfRows[(pixel.y * this.scalar) + i][margerX + ((pixel.x * this.scalar) + j)].opacity = 0.2;
        });
        margerX += (5 * this.scalar);
      })
      this.cdRef.detectChanges();
    }, 1000);
  }

  createStar({ x, y }, index) {
    const radius = 0.5 + Math.random() * 1;
    const delay = 0;
    const duration = 3000 + Math.random() * 4000;
    const brightness = 0.7 + Math.random() * 0.1;
    const starInstance = this.renderer.createElement('g', 'svg');
    const starReference = this.renderer.createElement('circle', 'svg');

    this.renderer.setAttribute(starInstance, 'transform', `translate(${x},${y})`);
    this.renderer.setAttribute(starReference, 'r', String(radius));
    starInstance.classList.add('star-instance');
    starReference.classList.add('star');
    starReference.style.setProperty('--star-animation-delay', `${delay}ms`);
    starReference.style.setProperty('--star-animation-duration', `${duration}ms`);
    starReference.style.setProperty('--star-animation-glow-duration', `10000ms`);
    starReference.style.setProperty('--star-brightness', `${brightness}`);
    starInstance.appendChild(starReference);
    return starInstance;
  };

  createCloud({ x, y }, index) {

    let pathD = "M188.432367,58.216891L184.060019,58.216891C184.270735,56.889138,184.376093,55.510317,";
    pathD += "184.376093,54.131496C184.376093,39.194267,171.864858,27.065748,156.456284,27.065748C154.296450,27.";
    pathD += "065748,152.189295,27.295551,150.187497,27.755158C144.419160,11.592311,128.589155,0,109.967170,0C87";
    pathD += ".631323,0,69.299071,16.699056,67.560668,37.917581C64.557972,36.691962,61.265542,36.002551,57.81507";
    pathD += "5,36.002551C44.724372,36.002551,34.004219,45.781968,33.003321,58.216891L12.274180,58.216891C5.5049";
    pathD += "43,58.216891,0,64.115182,0,71.366759C0,78.618337,5.504943,84.516627,12.274180,84.516627L188.432367";
    pathD += ",84.516627C195.201603,84.516627,200.706547,78.618337,200.706547,71.366759C200.706547,64.115182,195";
    pathD += ".201603,58.216891,188.432367,58.216891Z";

    const yAxis = -100 + (Math.random() * 350);
    const duration = 45000 + Math.random() * 65000;
    const delay = Math.random() * 70000;
    const cloudGroup = this.renderer.createElement('g', 'svg');
    const cloudSvg = this.renderer.createElement('svg', 'svg');
    const cloudReference = this.renderer.createElement('path', 'svg');

    this.renderer.setAttribute(cloudGroup, 'transform', "translate(-500,-500)");
    this.renderer.setAttribute(cloudGroup, 'id', "edp00lhwzc1q4_to");
    this.renderer.setAttribute(cloudReference, 'd', pathD);
    this.renderer.setAttribute(cloudReference, 'id', "edp00lhwzc1q4");
    this.renderer.setAttribute(cloudReference, 'fill', '#fff');
    this.renderer.setAttribute(cloudReference, 'fill-opacity', '0.5');
    this.renderer.setAttribute(cloudReference, 'stroke', 'none');
    this.renderer.setAttribute(cloudReference, 'stroke-width', '1');

    cloudGroup.style.setProperty('animation', `movemen ${duration}ms linear infinite normal forwards`);
    cloudGroup.style.setProperty('animation-delay', `${delay}ms`);
    cloudGroup.style.setProperty('--yAxis', `${yAxis}px`);
    cloudGroup.style.setProperty('--delay', `${delay}ms`);
    cloudSvg.appendChild(cloudReference)
    cloudGroup.appendChild(cloudSvg)
    return cloudGroup;
  };

  createSky(container) {
    if (this.dayTime == 'night') {
      this.stars = this.generateStarData();
      this.stars.forEach((data, index) => {
        const star = this.createStar(data, index);
        this.renderer.appendChild(container.nativeElement, star);
      });
    } else {
      this.clouds = this.generateCloudData();
      this.clouds.forEach((data, index) => {
        const cloud = this.createCloud(data, index);
        this.renderer.appendChild(container.nativeElement, cloud);
      });
    }
  };

  generateStarData() {
    var tempArray = [];
    for (var i = 0; i < 500; i++) {
      if (this.sky)
        tempArray.push({
          "x": Math.random() * this.sky.nativeElement.offsetWidth,
          "y": (Math.random() * this.sky.nativeElement.offsetHeight) - 500
        });
    }
    return tempArray;
  };

  generateCloudData() {
    var tempArray = [];
    for (var i = 0; i < 30; i++) {
      tempArray.push({
        "y": Math.random() * 5
      });
    }
    return tempArray;
  };

}
