import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { VideoPlayerService } from '../video-player.service';

@Component({
  selector: 'app-finalizacion-proceso',
  templateUrl: './finalizacion-proceso.component.html',
  styleUrls: ['./finalizacion-proceso.component.scss']
})
export class FinalizacionProcesoComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  constructor(
    private router: Router,
    private videoPlayerService: VideoPlayerService,
  ) { }

  ngOnInit(): void {

    Swal.fire({
      title: 'Felicitaciones has completado tu validación de identidad',
      width: 600,
      padding: '3em',
      color: '#6761CE',
        backdrop: `
      rgba(0,0,123,0.5)
      url('../../assets/imgs/imageFabio.png')
      left top
      no-repeat
    `
    }).then((result) => {
      if (result.isConfirmed) {

        this.videoElement.nativeElement.pause();
        this.videoPlayerService.rekognition = false;
        this.videoPlayerService.documentosOk = false;
        window.location.reload();
      }
    });

  }

  finalizado() {
    this.videoElement.nativeElement.pause();
    this.videoPlayerService.rekognition = false;
    this.videoPlayerService.documentosOk = false;
    window.location.reload();

  }

  loadedMetaData(): void {
    this.videoElement.nativeElement.pause();
  }
}
