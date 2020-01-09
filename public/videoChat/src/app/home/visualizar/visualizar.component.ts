import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.scss']
})
export class VisualizarComponent implements OnInit {
  // @ViewChild('play') play: ElementRef;
  // @ViewChild('logger') logger: ElementRef;
 img ;
 log;
 acceptedVideo = false;
  constructor(private renderer: Renderer2 , private socket: Socket) {

  }


  ngOnInit() {
    this.socket.on('streamPetition', (user) => {
      console.log(user);
      const button = this.renderer.selectRootElement('button', true);
      this.renderer.setStyle(button, 'visibility', 'visible');
    });
    console.log('on init');
  }



public initializeSocket() {

  this.socket.on('stream', (image) => {
    const videoConf = this.renderer.selectRootElement('#play', true);
    const logger = this.renderer.selectRootElement('#logger', true);
    videoConf.src  = image;
    logger.innerHTML = image;
});


}

public viewVideo() {
 this.initializeSocket();
}

}
