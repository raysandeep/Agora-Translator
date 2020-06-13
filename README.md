# Agora-Translator

This tutorial enables you to add **Agora Translation to Agora's 1-to-1 Video call on Web** using the sample app to give you an in-depth view on how to develop with the [Agora API](https://docs.agora.io/en/2.2/product/Voice/API%20Reference/communication_web_audio#voice-call-api)

 - HTML5 Canvas
 - Google Translator
 - Web sockets
 - OpenCV

## Prerequisites
- Agora.io Developer Account
- Python and web sockets

## Quick Start
This section shows you how to prepare, build, and run the sample application.

1. Create a developer account at [agora.io](https://dashboard.agora.io/signin/). Once you finish the signup process, you will be redirected to the Dashboard.
2. Navigate in the Dashboard tree on the left to **Projects** > **Project List**.
3. Copy the App ID that you obtained from the Dashboard into a text file. You will need this to use the Agora platform.
4. Generate a Token with channel name `any-channel` and copy it into a text file. 

### Run the Flask Server

1. Open the `Server` directory and install the Python requirements through the terminal command.
```python
    pip install -r requirements.txt
```
2. After install the requirements, run the server using
```python
    python server.py
```
3. Keep the server running.

### Update and Run the Sample Application 

1. Open the [script.js](scripts/script.js) file under the `scripts` directory in a code editor.
2. Under Client Setup replace the `APP_ID` and `TOKEN` with the App Id and Token obtained from the dashboard.
3. Open the `index.html` file in a web browser and allow access to Camera and Microphone for Audio and Video transmission.
4. For a demo, open the same file in an `new tab`, this creates the `remote stream` that is displayed on the Canvas.
