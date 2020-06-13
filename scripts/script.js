let handleFail = function (err) {
  console.log("Error : ", err);
};
let handleFail1 = function (err) {
  console.log("Error this: ", err);
};

const socket = io.connect("ws://localhost:8000/ml");

// Queries the container in which the remote feeds belong
let remoteContainer = document.getElementById("remote-container");
let canvasContainer = document.getElementById("canvas-container");
let resultContainer = document.getElementById("result-container");
let canvas, canvasPromise, resolve, reject;
canvasPromise = new Promise(function (res, rej) {
  resolve = res;
  reject = rej;
});


function addVideoStream(streamId) {
  let streamDiv = document.createElement("div"); // Create a new div for every stream
  streamDiv.id = streamId; // Assigning id to div
  streamDiv.style.transform = "rotateY(180deg)"; // Takes care of lateral inversion (mirror image)
  remoteContainer.appendChild(streamDiv); // Add new div to container
}

function removeVideoStream(evt) {
  let stream = evt.stream;
  stream.stop();
  let remDiv = document.getElementById(stream.getId());
  remDiv.parentNode.removeChild(remDiv);

  let remCanvas = document.getElementById("canvas" + stream.getId());
  remCanvas.parentNode.removeChild(remCanvas);

  canvasProps[stream.getId()] = undefined;

  console.log("Remote stream is removed " + stream.getId());
}
let canvasProps = {};

function addCanvas(streamId) {
  canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let video = document.getElementById(`video${streamId}`);

  video.addEventListener("loadedmetadata", function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvasProps[streamId] = {
      height: video.videoHeight,
      width: video.videoWidth,
    };
  });

  video.addEventListener(
    "play",
    function () {
      resolve();
      var $this = this; //cache

      (function loop() {
        if (!$this.paused && !$this.ended) {
          canvas.width = 640;
          canvas.height = 480;
          var ctx = canvas.getContext("2d");
          ctx.drawImage($this, 0, 0);
          setTimeout(loop, 1000 / 30); // drawing at 30fps
        }
      })();
    },
    0
  );


}

// Defines a client for RTC
function handleSocket(streamId) {
  if (streamId == "") {
    streamId = document.getElementById("capture").value;
  }
  //   addCanvas(streamId)
  const socket = io.connect("ws://localhost:8000/ml");

  socket.on("connect", (d, e) => {
    console.log("connected to socket !");
    var video = document.getElementById("video" + streamId);
    var canvas = document.createElement("canvas");
    video.pause();
    canvas.width = 640;
    canvas.height = 480;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let img = canvas.toDataURL();
    img = img.split("data:image/png;base64,")[1];
    console.log("Send data", { image: img });
    socket.emit("json", { image: img });
    video.play();
  });

  socket.on("message", function (message) {
    let newImg = document.getElementById("result-container");
    newImg.innerHTML = "Translated Text : " + message.result;
  });
  
}


let client = AgoraRTC.createClient({
  mode: "live",
  codec: "h264",
});

// Client Setup
// Defines a client for Real Time Communication
client.init(
  "APP_ID",
  function () {
    client.join(
      "TOKEN",
      "any-channel",
      null,
      (uid) => {
        // Stream object associated with your web cam is initialized

        let localStream = AgoraRTC.createStream({
          streamID: uid,
          audio: false,
          video: true,
          screen: false,
        });

        // Associates the stream to the client
        localStream.init(function () {
          //Plays the localVideo
          localStream.play("me");

          //Publishes the stream to the channel
          client.publish(localStream, handleFail);
          document.getElementById("capture").value = uid;
          // handleSocket(uid);
        }, handleFail);
      },
      handleFail1
    );
  },
  handleFail
);
// The client joins the channel

//When a stream is added to a channel
client.on("stream-added", function (evt) {
  client.subscribe(evt.stream, handleFail);
});
//When you subscribe to a stream
client.on("stream-subscribed", function (evt) {
  let stream = evt.stream;
  addVideoStream(stream.getId());
  stream.play(stream.getId());
  addCanvas(stream.getId());
});
//When a person is removed from the stream
client.on("stream-removed", removeVideoStream);
client.on("peer-leave", removeVideoStream);
