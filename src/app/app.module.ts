import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ImageDocumentComponent } from './image-document/image-document.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { RecoknitionComponent } from './recoknition/recoknition.component';
import { FinalizacionProcesoComponent } from './finalizacion-proceso/finalizacion-proceso.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [

    ImageDocumentComponent,
    AppComponent,
    VideoPlayerComponent,
    RecoknitionComponent,
    FinalizacionProcesoComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
