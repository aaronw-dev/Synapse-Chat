const loginvalmsg = document.getElementById("loginvalmsg")
const signupvalmsg = document.getElementById("signupvalmsg")
const togglesignup = document.getElementById("togglesignup")
const logincontainer = document.getElementById('login');
const signupcontainer = document.getElementById('signup');
logincontainer.hidden = false
signupcontainer.hidden = true
loginvalmsg.hidden = true
signupvalmsg.hidden = true
var isLoggingIn = true
function isValid(string) {
    return !(typeof string === "string" && string.length === 0)
}

togglesignup.addEventListener("click", function (e) {
    logincontainer.hidden = !logincontainer.hidden
    signupcontainer.hidden = !signupcontainer.hidden
    isLoggingIn = !isLoggingIn

    Array.from(logincontainer.childNodes[1].elements).forEach((input) => {
        if (input.tagName == "INPUT")
            input.value = ""
    });
    Array.from(signupcontainer.childNodes[1].elements).forEach((input) => {
        if (input.tagName == "INPUT")
            input.value = ""
    });
})

window.addEventListener("keypress", function (e) {
    if (e.code == "Enter") {
        if (isLoggingIn)
            loginForm()
        else
            signupForm()
    }
})

function loginForm() {
    const email = document.getElementById("login_emailinput")
    const password = document.getElementById("login_passwordinput")
    if (email.checkValidity() && isValid(password.value)) {
        loginvalmsg.hidden = true
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/login");
        xhr.onload = function (event) {
            var jsonresponse = JSON.parse(event.target.response)
            if (jsonresponse["auth_result"] == "success") {
                console.log("Login success!")
                window.location == window.location.assign(window.location.origin + "/messaging")
            } else if (jsonresponse["auth_result"] == "failed") {
                console.log("Login failed.")
            }
        };
        var formData = new FormData(document.getElementById("loginform"));
        xhr.send(formData);
    } else {
        loginvalmsg.hidden = false
        if (!email.checkValidity() && !isValid(password.value)) {
            loginvalmsg.innerHTML = "Please enter a valid email address and password."
        } else if (!email.checkValidity()) {
            loginvalmsg.innerHTML = "Please enter a valid email address."
        } else if (!isValid(password.value)) {
            loginvalmsg.innerHTML = "Please enter a password."
        }
    }
}


function signupForm() {
    const email = document.getElementById("signup_emailinput")
    const password = document.getElementById("signup_passwordinput")
    const username = document.getElementById("signup_usernameinput")
    const file = document.getElementById("signup_fileinput")
    if (email.checkValidity() && isValid(password.value) && isValid(username.value) && file.checkValidity()) {
        signupvalmsg.hidden = true
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/signup");
        xhr.onload = function (event) {
            alert("Successfully signed up.");
        };
        var formData = new FormData(document.getElementById("signupform"));
        xhr.send(formData);
    } else {
        signupvalmsg.hidden = false
        if (!(email.checkValidity() && !isValid(password.value)) && !isValid(username.value)) {
            signupvalmsg.innerHTML = "Please enter a valid email address and password."
        } else if (!(email.checkValidity() && !isValid(password.value))) {
            signupvalmsg.innerHTML = "Please enter a valid email address and password."
        } else if (!email.checkValidity()) {
            signupvalmsg.innerHTML = "Please enter a valid email address."
        } else if (!isValid(password.value)) {
            signupvalmsg.innerHTML = "Please enter a password."
        } else if (!isValid(username.value)) {
            signupvalmsg.innerHTML = "Please enter a username."
        }
    }
}