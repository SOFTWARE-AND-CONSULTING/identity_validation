import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FinalizacionProcesoComponent } from './finalizacion-proceso/finalizacion-proceso.component';
import { DocumentOkGuard } from './guards/document-ok.guard';
import { RekognitionGuard } from './guards/rekognition.guard';
import { ImageDocumentComponent } from './image-document/image-document.component';
import { RecoknitionComponent } from './recoknition/recoknition.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

const routes: Routes = [
  {
    path: 'documentos',
    component: ImageDocumentComponent
  },
  {
    path: 'rekognition',
    canActivate: [DocumentOkGuard],
    component: RecoknitionComponent,
  },
  {
    path: 'finalizacion',
    canActivate: [RekognitionGuard],
    component: FinalizacionProcesoComponent,
  },
  {
    path: '**',
    redirectTo: '/documentos',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
