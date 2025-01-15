import {
  IMAGENOTIFICATION,
  PROCESSEDMESSAGE,
  WS_BASE_URL,
} from "../config/constants";

class SocketManager {
  static instance;
  socket;
  isReady;
  buffer;

  constructor() {
    this.isReady = false;
    this.buffer = [];
    this.socket = new WebSocket(WS_BASE_URL);
    this.init();
    this.addListeners();
  }

  /**
   * @returns {SocketManager}
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new SocketManager();
    }
    return this.instance;
  }

  init() {
    this.socket.onopen = () => {
      this.isReady = true;
      this.flushBuffer();
    };
  }

  flushBuffer() {
    this.buffer.forEach((message) => this.socket.send(message));
    this.buffer = [];
  }

  addListeners() {
    this.socket.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      switch (parsedMessage.method) {
        case PROCESSEDMESSAGE:
          // Handle the rendering of messages
          break;
        case IMAGENOTIFICATION:
          // Handle the rendering of image url
          break;
      }
    };
  }

  send(message) {
    if (this.isReady) {
      this.socket.send(message);
    } else {
      this.buffer.push(message);
    }
  }
}

export default SocketManager;
