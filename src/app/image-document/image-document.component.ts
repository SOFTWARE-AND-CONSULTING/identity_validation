import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoPlayerService } from '../video-player.service';
import * as toastFire from '../../assets/js/toast.js';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { reject } from 'lodash';
import { loadingFireToast } from "src/assets/js/toast";
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';

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
  token: any='';
  idValidacion: any;
  constructor(
    private apiService: ApiService,
    public videoPlayerService: VideoPlayerService,
    private sanitizer: DomSanitizer,
    private router: Router,) { }

  async ngOnInit() {

    /* Crear un usuario para generar luego el token*/
    //this.registro()

    /* verificar código */
    //this.verificarEmail();

    /* pedir nuevamente el código */
    //this.reSendCode()

    /* Login con el usuario creado */
    this.login()
  }

async login(){
  const body = {
    email: environment.ELOGIN,
    password: environment.PLOGIN
  }
  await this.apiService.post('login', body, '').subscribe(
    async (res: any) => {

      if (res.status == false) toastFire.toastFireError(res);
      else {
        this.token = res.data
        localStorage.setItem('token', `${this.token}`)

      }
    },
    (error: any) => {
      console.log('error enviando documento', error);
      toastFire.toastFireError(error);
    }
  );
}

async registro(){
  const data = {
    email:environment.ELOGIN,
    password:environment.PLOGIN,
    name:"demo",
    address: "direccion demo"
}
  await this.apiService.post('sign-up', data, '').subscribe(
    async (res: any) => {

      if (res.status == false) toastFire.toastFireError(res);
      else {
        console.log(res);


      }
    },
    (error: any) => {
      console.log('error enviando documento', error);
      toastFire.toastFireError(error);
    }
  );
}

async verificarEmail(){
  const verificar = {
      email:environment.ELOGIN,
      code: 123456
  }
  await this.apiService.post('confirm-code', verificar, '').subscribe(
    async (res: any) => {

      if (res.status == false) toastFire.toastFireError(res);
      else {
        console.log(res);


      }
    },
    (error: any) => {
      console.log('error enviando documento', error);
      toastFire.toastFireError(error);
    }
  );
}
async reSendCode(){
  const reSend = {
      email:environment.ELOGIN,
  }
  await this.apiService.post('resend-code', reSend, '').subscribe(
    async (res: any) => {

      if (res.status == false) toastFire.toastFireError(res);
      else {
        console.log(res);


      }
    },
    (error: any) => {
      console.log('error enviando documento', error);
      toastFire.toastFireError(error);
    }
  );
}



atras(){
  this.file = null;
  this.preview = '';
  $('#file').val('');
  this.documentsOk = false;
  this.imageFront = !this.imageFront;
  this.filesUploadFront = [];
}

async incomingfile(event:any) {

  this.file = event.target.files[0];

  this.extraerBase64(this.file).then((imagen:any) => {
    this.preview = imagen.base;
  })

}


async subirFrontal() {

    var image = this.urltoFile(this.preview, `image.jpg`, "image/jpg")
    image.then(async (img:any)=> {

      this.headersFront = {
        type: "FRONT",
        contentType: "image/jpg",
        extension: "jpg",
        documentType: "CC"
      }
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer '+this.token
        })
      };
      const loading: any = loadingFireToast(
        'Cargando documento, por favor espere...'
      );

      await this.apiService.post(`add-dni-person/CC${this.numeroCedula}`, this.headersFront, httpOptions).subscribe(
        async (res: any) => {
          loading.close();
          console.log(res);


          if (res.status == false) toastFire.toastFireError(res);
          else {
            this.idValidacion = res.data.validationId;
            localStorage.setItem('validationId', this.idValidacion)
            const httpOptionsPut = {
              headers: new HttpHeaders({
                'Content-Type':"image/jpg",
              })
            };
            await this.apiService.put(res.data.uploadUrl, img, httpOptionsPut).subscribe(
              async (res: any) => {
                loading.close();

                //if (res.status == false) toastFire.toastFireError(res);
                //else {
                  //console.log(res);


                //}
              },
              (error: any) => {
                loading.close();
                console.log('error enviando documento', error);
                toastFire.toastFireError(error);
              }
            );

          }
        },
        (error: any) => {
          loading.close();
          console.log('error enviando documento', error);
          toastFire.toastFireError(error);
        }
      );

    });




  this.imageFront = false
  this.file = null;
  this.preview = '';
  $('#file').val('');
}

async SubirImgT(){
  var image = this.urltoFile(this.preview, `image.jpg`, "image/jpg")
    image.then(async (img:any)=> {
      this.headersFront = {
        type: "BACK",
        contentType: "image/jpg",
        extension: "jpg",
        documentType: "CC",
        validationId: `${this.idValidacion}`
      }
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer '+this.token
        })
      };

      const loading: any = loadingFireToast(
        'Cargando documento, por favor espere...'
      );
      await this.apiService.post(`add-dni-person/CC${this.numeroCedula}`, this.headersFront, httpOptions).subscribe(
        async (res: any) => {
          loading.close();

            this.imageFront = false
            this.documentsOk = true;
            this.videoPlayerService.documentosOk = true;
            localStorage.setItem('documentOk', 'true');
            localStorage.setItem('cedula', `${this.numeroCedula}`)
          if (res.status == false) toastFire.toastFireError(res);
          else {
            const httpOptionsPut = {
              headers: new HttpHeaders({
                'Content-Type': "image/jpg",
              })
            };

            await this.apiService.put(res.data.uploadUrl, img, httpOptionsPut).subscribe(
              async (res: any) => {
                loading.close();

                /* if (res.status == false) toastFire.toastFireError(res);
                else {
                  console.log(res);


                } */
              },
              (error: any) => {
                loading.close();
                console.log('error enviando documento', error);
                toastFire.toastFireError(error);
              }
            );

          }
        },
        (error: any) => {
          loading.close();
          console.log('error enviando documento', error);
          toastFire.toastFireError(error);
        }
      );
    });




  //this.videoPlayerService.cargaDocOk = true;



}

urltoFile(url, filename, mimeType){
  return (fetch(url)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){return new File([buf], filename, {type:mimeType});})
  );
}

SubirDocumentos() {
  console.log(this.videoPlayerService.documentosOk);

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
