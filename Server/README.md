# Server setup
1. Install requirements
```py
    pip install -r requirements.txt
```
2. Run server using
```py
    python server.py
```
3. Keep the server running.
4. Server runs at [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
5. Once the server is running, test it by clicking on the above URL
6. A message `Hello World!` should appear in the browser.
7. The server is up and running. :smiley:


## Web sockets

#### Request

Setting up the web socket with the URL and send the data in JSON format.

```py
URL = "http://127.0.0.1/ml"
JSON = {
    'image': base64 encoded image
}
```

#### Response

The server responds with a JSON object with an encoded image with the face detection and predicted emotion.

```py
JSON = {
    'image': base64 encoded image
}
```

