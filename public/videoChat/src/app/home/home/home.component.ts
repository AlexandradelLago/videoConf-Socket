import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Socket } from 'ngx-socket-io';

declare let RTCPeerConnection: any;

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
  peerConnection;
  isAlreadyCalling: boolean;
  constructor(private renderer: Renderer2, private socket: Socket) { }

  ngOnInit() {
    this.peerConnection = new RTCPeerConnection();
    this.peerConnection.ontrack = ({ streams: [stream] }) => {
      const remoteVideo = this.renderer.selectRootElement('#remote-video');
      if (remoteVideo) {
        remoteVideo.srcObject = stream;
      }
     };
    this.isAlreadyCalling = false;
    this.video = this.renderer.selectRootElement('#local-video');
    this.initializeSocket();
  }

  initializeSocket() {
    const that = this;
    this.socket.on('validate', () => {
      clearInterval(that.interval);
     // this.stop();
    });

    this.socket.on('answer-made', async data => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      if (!this.isAlreadyCalling) {
        this.callUser(data.socket);
        this.isAlreadyCalling = true;
      }
     });

    this.socket.on('stream', (data) => {
    //  const videoConf = that.renderer.selectRootElement('#play', true);
      that.videoUser.src  = data.image;
  });


  }

  // stop() {
  //   this.stopCamera({ video: true, audio: false });
  // }

  // start() {
  //   this.socket.emit('streamPetition', 'davinia roca');
  //   this.initCamera({ video: true, audio: false });

  // }

  sound() {
    this.callUser(this.socket.ioSocket);
    this.initCamera({ video: true, audio: true });
  }

  async callUser(socketId){
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    this.socket.emit('call-user', {
      offer,
      to: 'socketIdDaviniaRoca' // socketID
    });
  }

initCamera(config: any) {

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
  }).catch(err => console.log('camaraga no conectada, revise su camara', err));
  // this.interval = setInterval(() => {
  // this.viewVideo(this.video, this.context);
  // }, 500);
  // console.log(this.interval);

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



// pause() {
//   this.video.pause();
// }


// resume() {
//   this.video.play();
// }


}





















