from datetime import datetime
import json
import threading
from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit
from colors import *
import os
from random import randint
from PIL import Image
from emailsend import sendEmail
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import random
import string
import hashlib
from generate_avatar import generateavatar
import time

cred = credentials.Certificate('serverside/creds.json')
app = firebase_admin.initialize_app(cred)

db = firestore.client()
os.system("")
app = Flask(__name__)
socketio = SocketIO(app, ping_timeout=5000, ping_interval=10000)

with open("serverside/avatarapi.key", "r") as file:
    avatarapikey = file.read()

connectedusers = {}
activecookies = []

'''sendEmail(
    "Johnny Bellwood",
    "riptidegamesceo@gmail.com",
    "I'm alive!",
    "Yep, I sure am."
)'''


def crop_center(pil_img, crop_width, crop_height):
    img_width, img_height = pil_img.size
    return pil_img.crop(((img_width - crop_width) // 2,
                         (img_height - crop_height) // 2,
                         (img_width + crop_width) // 2,
                         (img_height + crop_height) // 2))


def generate_id(length):
    characters = string.ascii_letters + string.digits
    result = ''.join(random.choice(characters) for _ in range(length))
    return result


def expire_cookie(expiration_time, cookie):
    global activecookies
    start_time = time.time()

    variable_expired = False
    while not variable_expired:
        elapsed_time = time.time() - start_time
        if elapsed_time >= expiration_time:
            variable_expired = True
            activecookies.remove(cookie)
        time.sleep(1)


def generate_cookie_string(length):
    characters = string.ascii_letters + string.digits
    cookie = ''.join(random.choice(characters) for _ in range(length))
    return cookie


@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/messaging')
def messaging():
    return render_template('messaging.html')


@app.route('/account')
def account():
    return render_template('account.html')


@app.route('/login', methods=["POST"])
def login():
    email = request.form["email"]
    password = request.form["password"]
    userauthenticated = False
    for doc in db.collection("accounts").stream():
        userinfo = doc.to_dict()
        if (email == userinfo["email"] and password == userinfo["password"]):
            userauthenticated = True
    if (userauthenticated):
        cookie = generate_cookie_string(69)
        activecookies.append(cookie)
        expiration_thread = threading.Thread(
            target=lambda: expire_cookie(expiration_time=3600, cookie=cookie))
        expiration_thread.start()
        return json.dumps({"auth_result": "success", "cookie": cookie})
    else:
        return json.dumps({"auth_result": "failed", "cookie": ""})


@app.route('/signup', methods=["POST"])
def signup():
    username = request.form["username"]
    email = request.form["email"]
    password = request.form["password"]
    password = hashlib.sha256(bytes(password, "ascii")).hexdigest()
    generatedid = generate_id(20)
    # Save profile image full resolution
    newpath = f'static/imagestore/users/{generatedid}'
    if not os.path.exists(newpath):
        os.makedirs(newpath)

    # Add user to FireStore
    userdata = {
        "email": email,
        "password": password,
        "username": username
    }
    db.collection("accounts").document(generatedid).set(userdata)

    # Profile picture creation
    image = generateavatar(apikey=avatarapikey, name=username)
    if (image.width > image.height):
        squareimage = crop_center(image, image.height, image.height)
    else:
        squareimage = crop_center(image, image.width, image.width)
    squareimage.save(f'static/imagestore/users/{generatedid}/512x512.png')
    fifty = squareimage.resize((50, 50))
    fifty.save(f'static/imagestore/users/{generatedid}/50x50.png')
    hundo = squareimage.resize((100, 100))
    hundo.save(f'static/imagestore/users/{generatedid}/100x100.png')

    return "Successfully signed up."


@socketio.on('message')
def landing_page(payload):
    print(payload["message"])


@socketio.on('ping')
def ping():
    emit("pingresponse")


@app.errorhandler(500)
def fivehundrederror(error):
    return render_template("error.html", errorcode=error)


@app.errorhandler(404)
def invalid_route(error):
    return render_template("error.html", errorcode=error)


if __name__ == '__main__':
    print(CYELLOW + "Running on " + CBLUE + "http://127.0.0.1:5000" + CEND)
    socketio.run(app, host='0.0.0.0', port=5000)
