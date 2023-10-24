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
const keySize = 2048
const jsEncrypt = new JSEncrypt({ default_key_size: keySize });
var socket = io();

async function generateRSAKeyPair(keySize) {
    try {

        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: keySize, // Key size in bits
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
                hash: 'SHA-256', // Hashing algorithm to use
            },
            true, // Can be used for encryption
            ['encrypt', 'decrypt'] // Key usages
        );

        // Export public key as ASCII
        const publicKey = btoa(String.fromCharCode.apply(null, new Uint8Array(await window.crypto.subtle.exportKey('spki', keyPair.publicKey))));

        // Export private key as ASCII
        const privateKey = btoa(String.fromCharCode.apply(null, new Uint8Array(await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey))));

        return {
            publicKey: publicKey,
            privateKey: privateKey,
        };
    } catch (error) {
        console.error('Error generating RSA key pair:', error);
    }
}

async function init() {
    const keySize = 4096;
    var pubkey, privkey;
    await generateRSAKeyPair(keySize).then((keyPair) => {
        pubkey = keyPair.publicKey;
        privkey = keyPair.privateKey;
    });
    function createEventListeners() {
        window.addEventListener("keypress", function (e) {
            if (e.code == "Enter" && document.activeElement === messagebox) {
                sendMessage()
            }
        })
        sendbutton.addEventListener("click", function (e) {
            sendMessage()
        })
    }
    createEventListeners();
    function sendMessage() {
        if (messagebox.value === "")
            return
        var messagediv = document.createElement("div")
        messagediv.classList = "user message"
        messagediv.innerHTML = messagebox.value
        messagecontainer.appendChild(messagediv)
        var encryptor = new JSEncrypt({ default_key_size: keySize });
        encryptor.setPublicKey(pubkey)
        var encryptedmessage = encryptor.encrypt(messagebox.value)
        socket.emit("message", { message: encryptedmessage })
        messagebox.value = "";
    }
}

init()