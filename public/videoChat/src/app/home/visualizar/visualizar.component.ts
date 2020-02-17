import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Socket } from 'ngx-socket-io';

// import { AudioContext } from 'angular-audio-context';
// import { isSupported } from 'angular-audio-context';


@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.scss']
})
export class VisualizarComponent implements OnInit {

  img;
  log;
  context;
  canvas;
  video;
  interval;
  audioConverted;
  constructor(private renderer: Renderer2, private socket: Socket) {

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
      videoConf.src = image;
      logger.innerHTML = image;
    });

    //   this._socket.socket.on('streamReceiver', (info) => {
    //     const videoUser = this.renderer.selectRootElement('#receivedVideoImg', true);
    //     //videoUser.src = info.image;
    //     let sourceStream = new AudioContext();
    //     sourceStream.createMediaStreamSource(info.buff);
    //     // let sourceStream = new MediaSourceStream({
    //     //   mimeType: 'video/webm; codecs="opus,vp8"'
    //     // });
    //     // sourceStream.write(info.buff);
    //     videoUser.src = window.URL.createObjectURL(info.buff);
    //     //     $('#logger').text(image);
    //     // })
    //   });
    // }
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
      this.video.volume = 0;
      this.video.play();

      const audioCtx = new AudioContext();
      const audioInput = audioCtx.createMediaStreamSource(stream);
      const bufferSize = 2048;

      const recorder = audioCtx.createScriptProcessor(bufferSize, 1, 1);

      const onAudio = (e) => {
        const mic = e.inputBuffer.getChannelData(0);
        function convertFloat32ToInt16(buffer) {
          let l = buffer.length;
          const buf = new Int16Array(l);
          while (l--) {
            buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
          }
          return buf.buffer;
        }
        this.audioConverted = convertFloat32ToInt16(mic);
      }
      recorder.onaudioprocess = onAudio;

      audioInput.connect(recorder);

      recorder.connect(audioCtx.destination);

    }).catch((err, message, code) => console.log('camaraga no conectada, revise su camara', err, code, message));


    this.interval = setInterval(() => {
      this.viewVideo();
    }, 500);
    console.log(this.interval);

  }




  viewVideo() {
    this.context.drawImage(this.video, 0, 0, this.context.width, this.context.height);
    this.socket.emit('stream', {image: this.canvas.toDataURL('image/webp'), audio : this.audioConverted});
  }

  public validateCard() {
    const button = this.renderer.selectRootElement('button', true);
    this.renderer.setStyle(button, 'visibility', 'hidden');
    const videoConf = this.renderer.selectRootElement('#play', true);

    videoConf.src = '';

    this.socket.emit('validate');
  }
}



    //   const option = {mimeType: 'video/webm; codecs=vp9'};
    //   const media = new MediaRecorder(stream, option);
    //   media.ondataavailable = function (e) {
    //     let info;
    //       info = { image: e.data};
    //
    //     this._socket.socket.emit('stream', info);
    //   };
    //   media.start(1000);
    // })
