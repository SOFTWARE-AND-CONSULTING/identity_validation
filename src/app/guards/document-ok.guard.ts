import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { VideoPlayerService } from '../video-player.service';


@Injectable({
  providedIn: 'root'
})
export class DocumentOkGuard implements CanActivate {
  constructor(private router: Router,
    public videoPlayerService: VideoPlayerService,) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


      if (!this.videoPlayerService.documentosOk) {
        return this.router.navigate(['']).then(() => false);
      }
    return true;
  }

}
