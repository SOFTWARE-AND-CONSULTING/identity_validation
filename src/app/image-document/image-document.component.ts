import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoPlayerService } from '../video-player.service';
import * as toastFire from '../../assets/js/toast.js';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { reject } from 'lodash';
import { loadingFireToast } from "src/assets/js/toast";
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-image-document',
  templateUrl: './image-document.component.html',
  styleUrls: ['./image-document.component.scss']
})
export class ImageDocumentComponent implements OnInit {
  file: any;
  filesUploadFront:Array<any> = [];
  filesUploadBack:Array<any> = [];
  headersFront:any = {};
  preview:string = '';
  imageFront: boolean=true;
  documentsOk: boolean=false;
  numeroCedula:any='';
  constructor(
    private apiService: ApiService,
    public videoPlayerService: VideoPlayerService,
    private sanitizer: DomSanitizer,
    private router: Router,) { }

  ngOnInit(): void {
  }

  async incomingfile(event:any) {

    this.file = event.target.files[0];

    this.extraerBase64(this.file).then((imagen:any) => {
      this.preview = imagen.base;

    })

}
atras(){
  this.file = null;
  this.preview = '';
  $('#file').val('');
  this.documentsOk = false;
  this.imageFront = !this.imageFront;
  this.filesUploadFront = [];
}
async subirFrontal() {
  this.filesUploadFront.push(this.file);
  this.headersFront = {
    type: "FRONT",
    contentType: "image/png",
    extension: "jpg",
    documentType: "CC"
  }
  console.log(this.filesUploadFront, this.numeroCedula);
  const loading: any = loadingFireToast(
    'Creando franja, por favor espere...'
  );
  await this.apiService.post(`add-dni-person/CC${this.numeroCedula}`, this.headersFront).subscribe(
    async (res: any) => {
      loading.close();
      console.log(res.message);

      if (res.status == false) toastFire.toastFireError(res);
      else {
        console.log(res);


      }
    },
    (error: any) => {
      loading.close();
      console.log('error enviando documento', error);
      toastFire.toastFireError(error);
    }
  );
  this.imageFront = false
  this.file = null;
  this.preview = '';
  $('#file').val('');
}

async SubirImgT(){
  this.filesUploadBack.push(this.file);
  this.imageFront = false
  this.documentsOk = true;
  this.videoPlayerService.documentosOk = true;
  //this.videoPlayerService.cargaDocOk = true;



}

SubirDocumentos() {
  let data = new FormData();
  data.append('file', this.file);
  this.router.navigate(['/rekognition']);
  /* this.apiService.post('loans/pagos-unir', data).subscribe(
    (res: any) => {
      if (res.status) {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Archivos subidos con éxito.',
        });
        this.file = null;
        $('#file').val('');

      }
    },
    (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error.',
        timer: 2000,
      });
      console.log('error enviendo los documentos', error);
    }
  ); */
}

extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
  try {
    const unsafeImg = window.URL.createObjectURL($event);
    const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
    const reader = new FileReader();
    reader.readAsDataURL($event);
    reader.onload = () => {
      resolve({
        base: reader.result
      });
    };
    reader.onerror = error => {
      resolve({
        base: null
      });
    };

  } catch (e) {

    return reject(e);
  }
})

}
