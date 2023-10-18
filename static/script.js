time = 1000;
/*navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    var mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    var audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", function (event) {
        audioChunks.push(event.data);
    });
    mediaRecorder.addEventListener("stop", function () {
        var audioBlob = new Blob(audioChunks);

        audioChunks = [];

        var fileReader = new FileReader();
        fileReader.readAsDataURL(audioBlob);
        fileReader.onloadend = function () {
            var base64Strings = fileReader.result.split(";");
            var base64 = base64Strings[1]
            var audio = new Audio("data:audio/wav;" + base64);
            audio.play();
        };

        mediaRecorder.start();


        setTimeout(function () {
            mediaRecorder.stop();
        }, time);
    });

    setTimeout(function () {
        mediaRecorder.stop();
    }, time);
});*/
const messagebox = document.getElementById("messagebox")
const messagecontainer = document.getElementById("message-container")
const emojibutton = document.getElementById("emoji-button")
const sendbutton = document.getElementById("send-button")
window.addEventListener("keypress", function(e){
    if(e.code == "Enter" && document.activeElement === messagebox){
        sendMessage()
    }
})
sendbutton.addEventListener("click", function(e){
    sendMessage()
})
function sendMessage(){
    if(messagebox.value === "")
        return
    var messagediv = document.createElement("div")
    messagediv.classList = "user message"
    messagediv.innerHTML = messagebox.value
    messagecontainer.appendChild(messagediv)
    messagebox.value = "";
}
