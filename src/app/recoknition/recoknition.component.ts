import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import { Router } from '@angular/router';
import {VideoPlayerService} from '../video-player.service';
import {FaceApiService} from '../face-api.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-recoknition',
  templateUrl: './recoknition.component.html',
  styleUrls: ['./recoknition.component.scss']
})
export class RecoknitionComponent implements OnInit, OnDestroy {

  public currentStream: any;
  public dimensionVideo: any;
  listEvents: Array<any> = [];
  overCanvas: any;
  listExpressions: any = [];
  expressionsFilter: Array<any> = [];
  neutral: any;
  valorNeutral: number = 0;
  NextLiveDatection: boolean = false;
  valorRandom: any;
  verificacionOk: boolean = false;
  pruebaVida: boolean = false;

  constructor(
    private faceApiService: FaceApiService,
    private videoPlayerService: VideoPlayerService,
    private renderer2: Renderer2,
    private router: Router,
    private elementRef: ElementRef
  ) {
    //

  }


  ngOnInit(): void {
    this.listenerEvents();
    this.checkMediaSource();
    this.getSizeCam();
  }

  ngOnDestroy(): void {
    this.listEvents.forEach(event => event.unsubscribe());
  }

  listenerEvents = () => {

    const observer1$ = this.videoPlayerService.cbAi
      .subscribe(({resizedDetections, displaySize, expressions, videoElement}) => {
        resizedDetections = resizedDetections[0] || null;
        // :TODO Aqui pintamos! dibujamos!
        if (resizedDetections) {
          this.listExpressions = _.map(expressions, (value, name) => {
            return {name, value};
          });
          this.expressionsFilter = []

          if(!this.NextLiveDatection){
            for(let i=0; i <= this.listExpressions.length; i++) {
              //this.expressionsFilter.push(array)
                if(this.listExpressions[i]?.name =='neutral') {

                  this.neutral = this.listExpressions.find( (exp:any) => {
                    return exp.name == 'neutral';
                  });
                }else if(this.listExpressions[i]?.name =='surprised' ){

                  const array = this.listExpressions.find( (exp:any) => {

                    return exp.name == 'surprised';
                  });
                  this.expressionsFilter.push(array)

                }else if(this.listExpressions[i]?.name =='happy'){
                  const array = this.listExpressions.find( (exp:any) => {

                    return exp.name == 'happy';
                  });
                  this.expressionsFilter.push(array)
                }

              }
              this.valorNeutral = this.valorNeutral + this.neutral.value

              if(this.valorNeutral >= 10) {
                this.NextLiveDatection = true
              }
              const valor = this.generateRandomInt(0,2)
              this.valorRandom = this.expressionsFilter[valor];

          }



          this.createCanvasPreview(videoElement);
          this.drawFace(resizedDetections, displaySize);
        }


      });

    this.listEvents = [observer1$];
  };

  liveDetectionRandom() {

    if(!this.NextLiveDatection){

    }


    this.listExpressions.forEach((item:any) =>{
      if(item.name==this.valorRandom.name){

        if(item.value >0.99){
          this.pruebaVida = true;
          this.videoPlayerService.rekognition = true;
        }
      }
    });

    if(this.pruebaVida){
      console.log('verificación ok');
      this.videoPlayerService.pruebaVida = true;
      this.verificacionOk = true;

      this.router.navigate(['/finalizacion']);
    }

  }



  generateRandomInt(min:any,max:any){
    return Math.floor((Math.random() * (max-min)) +min);
  }

  drawFace = (resizedDetections:any, displaySize:any) => {
    if (this.overCanvas) {
      const {globalFace} = this.faceApiService;
      this.overCanvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
      globalFace.draw.drawFaceLandmarks(this.overCanvas, resizedDetections);
    }
  };

  checkMediaSource = () => {
    if (navigator && navigator.mediaDevices) {

      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      }).then(stream => {
        this.currentStream = stream;

      }).catch(() => {
        console.log('**** ERROR NOT PERMISSIONS *****');
      });

    } else {
      console.log('******* ERROR NOT FOUND MEDIA DEVICES');
    }
  };

  getSizeCam = () => {
    const elementCam: HTMLElement |any = document.querySelector('.cam');
    const {width, height} = elementCam.getBoundingClientRect();
    this.dimensionVideo = {width, height};
  };

  createCanvasPreview = (videoElement: any) => {
    if (!this.overCanvas) {
      const {globalFace} = this.faceApiService;
      this.overCanvas = globalFace.createCanvasFromMedia(videoElement.nativeElement);
      this.renderer2.setProperty(this.overCanvas, 'id', 'new-canvas-preview');
      /* const elementPreview = document.querySelector('.canvas-preview');
      this.renderer2.appendChild(elementPreview, this.overCanvas); */
    }
  };

}
