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
  interval;
  videoUser;
  img ;
  constructor(private renderer: Renderer2, private socket: Socket) { }

  ngOnInit() {
    this.video = this.renderer.selectRootElement('video');
    this.canvas = this.renderer.selectRootElement('#preview');
    this.videoUser = this.renderer.selectRootElement('#play');
    this.initializeSocket();
  }

  initializeSocket() {
    // const videoAux = this.renderer.selectRootElement('video');
    // const intervalAux = this.interval;
    const that = this;
    this.socket.on('validate', () => {
      // videoAux.load();
      // clearInterval(intervalAux);
      clearInterval(that.interval);
      this.stop();
    });

    this.socket.on('stream', (data) => {
    //  const videoConf = that.renderer.selectRootElement('#play', true);
      that.videoUser.src  = data.image;

      const audioCtx = new AudioContext();
      const buffer = convertInt16ToFloat32(data.audio);

      const src = audioCtx.createBufferSource();
      const audioBuffer = audioCtx.createBuffer(1, buffer.byteLength, audioCtx.sampleRate);

      audioBuffer.getChannelData(0).set(buffer);

      src.buffer = audioBuffer;

      src.connect(audioCtx.destination);

      src.start(0);

      function convertInt16ToFloat32(data) {
        const result = new Float32Array(data.byteLength);
        data.forEach(function(sample, i) {
          // 				result[i] = sample < 0 ? sample / 0x80 : sample / 0x7F;
          result[i] = sample / 32768;
        });
        return result;
      }
  });


  }

  stop() {
    this.stopCamera({ video: true, audio: false });
  }

  start() {
    this.socket.emit('streamPetition', 'davinia roca');
    this.initCamera({ video: true, audio: false });

  }
  sound() {
    this.socket.emit('streamPetition', 'davinia roca');
    this.initCamera({ video: true, audio: true });
  }

  stopCamera(config: any) {
    this.video.pause();
    const browser = navigator as any;
    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }).catch(err => console.log('camaraga no conectada, revise su camara', err));

    clearInterval(this.interval);

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
    this.video.volume = 0;
  }).catch(err => console.log('camaraga no conectada, revise su camara', err));
  this.interval = setInterval(() => {
  this.viewVideo(this.video, this.context);
  }, 500);
  console.log(this.interval);

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





















