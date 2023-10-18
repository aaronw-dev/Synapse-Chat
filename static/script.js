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