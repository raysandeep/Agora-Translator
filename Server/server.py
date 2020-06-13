from flask import Flask
from flask_socketio import SocketIO, send
import io
import base64
import cv2
from imageio import imread
import pytesseract       
from PIL import Image     
from googletrans import Translator    
import os

app = Flask(__name__)
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")


boundaries = [
			([0, 0, 120], [120, 160, 255]), #blue
			([20, 80, 20],[160, 255, 150]), #green
			([200, 30, 30], [255, 90, 90]), #red
			([0, 0, 0], [50, 50, 50]), #black
			([90, 0, 150], [160, 50, 255]),#purple
			([220, 100, 0],[255, 180, 50]), #orange
			([130, 0, 90],[255, 100, 170]) #pink
		]

@app.route("/")
def hello():
    return "Hello World!"


def check(img):
    result = pytesseract.image_to_string(img)
    p = Translator()                       
    k = p.translate(result,dest='german')       
    print(k.text) 
    return k.text

@socketio.on('json', namespace=r'/ml')
def mlhandler(message):
    print('Got image')
    image = message['image']
    img = imread(io.BytesIO(base64.b64decode(image)))
    cv2_horizontal = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    k='Nothing Found'
    flip_image = cv2.flip( cv2_horizontal, -1 )
    cv2_img = cv2.rotate(flip_image, cv2.ROTATE_180)
    filename = "{}.png".format(os.getpid())
    cv2.imwrite(filename, cv2_img)
    result = pytesseract.image_to_string(Image.open(filename))
    p = Translator()              
    k = p.translate(result,dest='german')
    k = k.text 
    print(k)
    os.remove(filename)
    send({'result': k})




if __name__ == '__main__':
    socketio.run(app, port=8000)

