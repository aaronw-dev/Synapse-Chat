from datetime import datetime
import json
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

cred = credentials.Certificate('serverside/creds.json')
app = firebase_admin.initialize_app(cred)

db = firestore.client()
os.system("")
app = Flask(__name__)
socketio = SocketIO(app, ping_timeout=5000, ping_interval=10000)

connectedusers = {}


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
        print("Authentication success.")
        return json.dumps({"auth_result": "success"})
    else:
        print("Authentication failed.")
        return json.dumps({"auth_result": "failed"})


@app.route('/signup', methods=["POST"])
def signup():
    username = request.form["username"]
    email = request.form["email"]
    password = request.form["password"]
    generatedid = generate_id(20)
    # Save profile image full resolution
    newpath = f'static/imagestore/users/{generatedid}'
    if not os.path.exists(newpath):
        os.makedirs(newpath)
    profileimage = request.files['profilepic']
    profileimage.save(f"static/imagestore/users/{generatedid}/fullres.png")

    # Add user to FireStore
    userdata = {
        "email": email,
        "password": password,
        "username": username
    }
    db.collection("accounts").document(generatedid).set(userdata)

    # Profile picture creation
    image = Image.open(f'static/imagestore/users/{generatedid}/fullres.png')
    if (image.width > image.height):
        squareimage = crop_center(image, image.height, image.height)
    else:
        squareimage = crop_center(image, image.width, image.width)
    squareimage.save(f'static/imagestore/users/{generatedid}/square.png')
    fifty = squareimage.resize((50, 50))
    fifty.save(f'static/imagestore/users/{generatedid}/50x50.png')
    hundo = squareimage.resize((100, 100))
    hundo.save(f'static/imagestore/users/{generatedid}/100x100.png')

    return "Successfully signed up."


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
