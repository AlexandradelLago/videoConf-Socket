import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  video;
  canvas;
  context;
  constructor(private renderer: Renderer2, private socket: Socket) { }

  ngOnInit() {
    this.video = this.renderer.selectRootElement('video');
    this.canvas = this.renderer.selectRootElement('#preview');
  }

  start() {
    this.socket.emit('streamPetition', 'davinia roca');
    this.initCamera({ video: true, audio: false });

  }
  sound() {
    this.initCamera({ video: true, audio: true });
  }

  initCamera(config: any) {
    const browser = navigator as any;
    this.context = this.canvas.getContext('2d');

    this.canvas.width = 800;
    this.canvas.height = 600;

    this.context.width = this.canvas.width;
    this.context.height = this.canvas.height;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.video.srcObject = stream;
      this.video.play();
    }).catch(err => console.log('camaraga no conectada, revise su camara', err));

    setInterval(() => {
      this.viewVideo(this.video, this.context);
    }, 500);
  }

  pause() {
    this.video.pause();
  }


  resume() {
    this.video.play();
  }

  viewVideo(stream, context) {
    context.drawImage(this.video, 0, 0, context.width, context.height);
    this.socket.emit('stream', this.canvas.toDataURL('image/webp'));
  }

}















