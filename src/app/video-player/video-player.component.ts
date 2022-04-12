import {AfterContentInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FaceApiService} from '../face-api.service';
import {VideoPlayerService} from '../video-player.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy  {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @Input() stream: any;
  @Input() width!: number;
  @Input() height!: number;
  modelsReady: boolean = false;
  listEvents: Array<any> = [];
  overCanvas: any;
  /* filters = [
    {
      type: 'question',
      question: '¿Estas subscrito a mi canal? <b>YOUTUBE</b>'
    },
     {
       type: 'image',
       image: 'sunglass-2.png'
     }
  ]; */
  arrayImages:Array<any> = [];

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private faceApiService: FaceApiService,
    private videoPlayerService: VideoPlayerService
  ) {
  }

/*   ngAfterContentInit() {
    setTimeout(this.ngOnInit, 2000)
  } */

 async ngOnInit() {
  await this.listenerEvents()
  }

  ngOnDestroy(): void {
    this.listEvents.forEach(event => event.unsubscribe());
  }

  async listenerEvents(){
    const observer1$ =  this.faceApiService.cbModels.subscribe(async (res) => {
      //: TODO Los modelos estan ready!!
      this.modelsReady = this.faceApiService.modelsReady;
      await this.checkFace();
    });
    this.modelsReady = this.faceApiService.modelsReady;

    const observer2$ = this.videoPlayerService.cbAi
      .subscribe(async ({resizedDetections, displaySize, expressions, eyes}) => {
        resizedDetections = resizedDetections[0] || null;
        // :TODO Aqui pintamos! dibujamos!
        if (resizedDetections) {
          this.drawFace(resizedDetections, displaySize, eyes);
        }
      });

    this.listEvents = [observer1$, observer2$];
  };

  async drawFace(resizedDetections:any, displaySize:any, eyes:any){
    this.arrayImages = []
    this.modelsReady = this.faceApiService.modelsReady;
    if (this.overCanvas) {
      const {globalFace} = this.faceApiService;

      for (let i =0; i <=5; i++) {
        var data = this.overCanvas.toDataURL('image/png');

        this.arrayImages.push(data)
      }
    //console.log(this.arrayImages);

    this.overCanvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
    // globalFace.draw.drawDetections(this.overCanvas, resizedDetections);
    // globalFace.draw.drawFaceLandmarks(this.overCanvas, resizedDetections);

    const scale = this.width / displaySize.width;


    /* const elementFilterEye = document.querySelector('.filter-eye');
    this.renderer2.setStyle(elementFilterEye, 'left', `${eyes.left[0].x * scale}px`);
    this.renderer2.setStyle(elementFilterEye, 'top', `${eyes.left[0].y * scale}px`); */
    }
  };

  checkFace = async () => {
    setInterval(async () => {
      await this.videoPlayerService.getLandMark(this.videoElement);
    }, 100);
  };

  loadedMetaData(): void {
    this.videoElement.nativeElement.play();

  }

  listenerPlay(): void {
    const {globalFace} = this.faceApiService;
    this.overCanvas = globalFace.createCanvasFromMedia(this.videoElement.nativeElement);
    this.renderer2.setProperty(this.overCanvas, 'id', 'new-canvas-over');
    this.renderer2.setStyle(this.overCanvas, 'width', `${this.width}px`);
    this.renderer2.setStyle(this.overCanvas, 'height', `${this.height}px`);
    this.renderer2.appendChild(this.elementRef.nativeElement, this.overCanvas);
  }
}
