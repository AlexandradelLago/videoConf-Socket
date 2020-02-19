import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Socket } from 'ngx-socket-io';



declare let RTCPeerConnection: any;

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
  peerConnection;
  constructor(private renderer: Renderer2, private socket: Socket) {
  }

  ngOnInit() {
    this.peerConnection = new RTCPeerConnection();
    this.peerConnection.ontrack = ({ streams: [stream] }) => {
      const remoteVideo = this.renderer.selectRootElement('#remote-video');
      if (remoteVideo) {
        remoteVideo.srcObject = stream;
      }
     };
    this.socket.on('call-made', async (data) => {
      console.log(data);

      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      this.socket.emit("make-answer", {
        answer,
        to: data.socket
      });

      const button = this.renderer.selectRootElement('button', true);
      this.renderer.setStyle(button, 'visibility', 'visible');

    });

    this.initCamera({})


  }


  initCamera(config: any) {
    this.video = this.renderer.selectRootElement('#local-video');
    const browser = navigator as any;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      if (this.video){
        this.video.srcObject = stream;
        this.video.volume = 0;
        this.video.play();
      }
      stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));

    }).catch((err, message, code) => console.log('camaraga no conectada, revise su camara', err, code, message));

  }






  public validateCard() {
    const button = this.renderer.selectRootElement('button', true);
    this.renderer.setStyle(button, 'visibility', 'hidden');
    const videoConf = this.renderer.selectRootElement('#play', true);

    videoConf.src = '';

    this.socket.emit('validate');
  }
}

