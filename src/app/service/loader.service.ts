import { ElementRef, Injectable, ViewChild, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor(@Inject(DOCUMENT) private document: HTMLDocument) {}

  presentLoader() {
    this.document.getElementById('cover-spin').style.display = 'block';
  }
  dismissLoader() {
    this.document.getElementById('cover-spin').style.display = 'none';
  }
}
