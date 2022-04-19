import {AfterContentInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FaceApiService} from '../face-api.service';
import { ApiService } from '../services/api.service';
import {VideoPlayerService} from '../video-player.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  imagesOk:boolean = true;
  headersFront:any = {};
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
  fileimagetype: any;
  fileimage: any;

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private faceApiService: FaceApiService,
    private videoPlayerService: VideoPlayerService,
    private apiService: ApiService,
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
      if(this.imagesOk){
          for (let i =0; i <=50; i++) {
            var data = this.overCanvas.toDataURL('image/png');
            /* var image = new Image();
            image.src = data; */
            var image = this.urltoFile(data, `image${i}.jpg`, "image/jpg")
            this.arrayImages.push(image)


          }
          this.arrayImages[49].then( async (file:any) => {
            const token = localStorage.getItem('token')
            const validationId = localStorage.getItem('validationId')
            console.log(file);

          this.headersFront = {
            contentType: "image/jpg",
            extension: "jpg",
            validationId: validationId
          }
          const httpOptions = {
            headers: new HttpHeaders({
              'Authorization': 'Bearer '+token
            })
          };
          const cedula = localStorage.getItem('cedula')
          await this.apiService.post('add-face-person/CC'+cedula, this.headersFront, httpOptions).subscribe(
            async (res: any) => {
              console.log(res);


              if (res.status == false) console.log('error enviando las imagenes', res.message);
              else {
                const httpOptionsPut = {
                  headers: new HttpHeaders({
                    'Content-Type': `${file.type}`,
                  })
                };
                await this.apiService.put(res.data.uploadUrl, file, httpOptionsPut).subscribe(
                  async (res: any) => {


                  },
                  (error: any) => {
                    console.log('error enviando documento', error);
                  }
                );
              }
            },
            (error: any) => {
              console.log('error enviando las imagenes', error);
            }
          );
          })



        this.imagesOk = false;

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


urltoFile(url, filename, mimeType){
   return (fetch(url)
       .then(function(res){return res.arrayBuffer();})
       .then(function(buf){return new File([buf], filename, {type:mimeType});})
   );
}

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
