import cv2
import threading
import time
import json


lock = threading.Lock()
frame_dictionary = {}

class CameraThread(threading.Thread):
    def __init__(self, camera_serial_number, video_path, frame_dictionary, fps):
        assert fps > 0, "FPS is not greater than 0"
        super(CameraThread, self).__init__()
        self.cam_serial_num = camera_serial_number
        self.video_path = video_path
        self.frame_dict = frame_dictionary
        self.running = True
        self.cap = None
        self.daemon = True
        self.sleep_duration = 1 / fps

    def run(self):
        self.cap = cv2.VideoCapture(self.video_path)
        if not self.cap.isOpened():
            print(f"Error: Failed to open video file {self.cam_serial_num}")
            return

        while self.running:
            ret, frame = self.cap.read()
            if ret:
                with lock:
                    self.frame_dict[self.cam_serial_num] = frame
                encoded_frame = cv2.imencode('.jpg', frame)[1].tobytes()
                # WebSocket implementation doesn't directly use `socketio.emit`, adjust as needed
                # Example: Sending frames can be integrated within WebSocket handler
            else:
                print(f"Error: Failed to receive frame from video file {self.cam_serial_num}")
                break  # Exit the loop if the video file ends
            time.sleep(self.sleep_duration)

        if self.cap:
            self.cap.release()

    def stop(self):
        self.running = False

def load_camera_config(json_file):
    try:
        with open(json_file, 'r', encoding="utf-8") as f:
            config = json.load(f)
        return config
    except FileNotFoundError as e:
        raise FileNotFoundError("Config file 'cameras.json' not found.") from e


