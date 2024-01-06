import { Component, OnInit } from '@angular/core';


declare var SockJS;
declare var Stomp;

@Component({
  selector: 'app-web-socket',
  templateUrl: './web-socket.component.html',
  styleUrls: ['./web-socket.component.scss']
})
export class WebSocketComponent implements OnInit {
  subject;
  stompClient;
  text;
  ngOnInit() {
    var socket = new SockJS('http://192.168.0.107:8080/stomp-endpoint');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame) => {
      this.stompClient.subscribe('/topic/greetings', (greeting) => {
        console.log(JSON.parse(greeting.body));
      });
    });
  }
  send() {
    console.log(this.stompClient);
    this.stompClient.ws.send(this.text);
  }
}
