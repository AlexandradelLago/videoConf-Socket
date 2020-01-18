import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.scss']
})
export class VisualizarComponent implements OnInit {

 img ;
 log;
 context;
 canvas;
 video;
 interval;
  constructor(private renderer: Renderer2 , private socket: Socket) {

  }

  ngOnInit() {
    this.socket.on('streamPetition', (user) => {
      console.log(user);
      const button = this.renderer.selectRootElement('button', true);
      this.renderer.setStyle(button, 'visibility', 'visible');
    });
    console.log('on init');

    this.socket.on('stream', (image) => {
      const videoConf = this.renderer.selectRootElement('#play', true);
      const logger = this.renderer.selectRootElement('#logger', true);
      videoConf.src  = image;
      logger.innerHTML = image;
  });
  }

  initCamera(config: any) {
    this.video = this.renderer.selectRootElement('video');
    this.canvas = this.renderer.selectRootElement('#preview');
    const myVideo = this.renderer.selectRootElement('img', true);
    this.renderer.setStyle(myVideo, 'visibility', 'visible');

    const browser = navigator as any;
    this.context = this.canvas.getContext('2d');

    this.canvas.width = 200;
    this.canvas.height = 400;

    this.context.width = this.canvas.width;
    this.context.height = this.canvas.height;


    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.video.srcObject = stream;
      this.video.play();
    }).catch((err, message, code) => console.log('camaraga no conectada, revise su camara', err, code ,message));
    this.interval = setInterval(() => {
    this.viewVideo(this.video, this.context);
    }, 500);
    console.log(this.interval);

  }

  viewVideo(stream, context) {
    context.drawImage(this.video, 0, 0, context.width, context.height);
    this.socket.emit('stream', this.canvas.toDataURL('image/webp'));
  }




public validateCard() {
  const button = this.renderer.selectRootElement('button', true);
  this.renderer.setStyle(button, 'visibility', 'hidden');
  const videoConf = this.renderer.selectRootElement('#play', true);

  videoConf.src  = '';

  this.socket.emit('validate');
}
}
