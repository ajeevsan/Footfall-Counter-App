import argparse
import datetime
import json
import numpy as np
import cv2
from ultralytics import YOLO

import camera

def configure_cameras(args, frame_dict):
    camera_threads = []
    camera_config = camera.load_camera_config(args.cameras_json)

    for _ , (cam_serial_num, rtsp_path) in enumerate(camera_config.items()):
        thread = camera.CameraThread(cam_serial_num, rtsp_path, frame_dict, args.fps)
        camera_threads.append(thread)
        thread.start()
    return camera_threads

def load_model(model):
    return YOLO(model)

def plot_roi(latest_frame, polygon, linepoints):
    pts = np.array(polygon, np.int32)
    pts = pts.reshape((-1,1,2))
    cv2.polylines(latest_frame, [pts], isClosed=True, color=(0,0,255), thickness=3)
    cv2.line(latest_frame, linepoints[0], linepoints[1], color=(0, 255, 255), thickness=2)

def plot_bbox_withid(latest_frame,box,id):
    str_id = str(int(id.item()))
    x1, y1, x2, y2 = box.xyxy[0]
    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
    cv2.rectangle(latest_frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
    cv2.putText(latest_frame, str_id, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 3, cv2.LINE_AA)


def inside_or_outside(box,linepoints):
    x1, y1, x2, y2 = box.xyxy[0]
    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
    centroid = [(x1+x2)//2, (y1+y2)//2]
    if (centroid[1]<linepoints[0][1]) or (centroid[1] < linepoints[1][1]):
        return "outside"
    return "inside"


def footfall_condition(box, polygon, crossed_ids):
    x1, y1, x2, y2 = box.xyxy[0]
    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
    centroid = [(x1 + x2) // 2, (y1 + y2) // 2]

    id = box.id[0]
    str_id = str(int(id.item()))

    if centroid[1] < (polygon[0][1] + polygon[1][1]) // 2:  # If the centroid is above the line
        if str_id not in crossed_ids:
            crossed_ids[str_id] = True
        return False, crossed_ids

    elif centroid[1] > (polygon[0][1] + polygon[1][1]) // 2:  # If the centroid is below the line
        if str_id in crossed_ids:
            if crossed_ids[str_id]:
                del crossed_ids[str_id]
                return True, crossed_ids
        return False, crossed_ids


def save_data_in_database(latest_frame,box,id,date_time):
    # save cropped image - extra padded img
    # save the ID and timestamp
    pass


def get_roi(roi_file):
    with open(roi_file,"r") as f:
        roi_file_content = f.read()
        polygon = json.loads(roi_file_content)
        point1 = polygon["polygon"]["point1"]
        point2 = polygon["polygon"]["point2"]
        point3 = polygon["polygon"]["point3"]
        point4 = polygon["polygon"]["point4"]
        polygon_points = [point1, point2, point3, point4]

        line_point1 = polygon["line"]["point1"]
        line_point2 = polygon["line"]["point2"]
        line_points = [line_point1,line_point2]

        return polygon_points, line_points

class PeopleCounter():
    def __init__(self,args) -> None:
        self.entry_count = 0
        self.visible_inside = 0
        self.visible_outside = 0
        self.crossed_ids = {}
        self.frame_dict = {}
        self.frame_shape = (1280,720)
        self.error_image = np.zeros((self.frame_shape[0], self.frame_shape[1], 3), dtype="uint8")
        self.latest_frame = np.ones((self.frame_shape[0], self.frame_shape[1], 3), dtype="uint8")
        self.camera_threads = configure_cameras(args, self.frame_dict)
        self.model = load_model(args.model)
        self.polygon, self.linepoints = get_roi(args.roi_file)

    def run(self):
        self.visible_inside = 0
        self.visible_outside = 0
        for thread in self.camera_threads:
            latest_frame = self.frame_dict.get(thread.cam_serial_num, self.error_image)
            detections = self.model.track(latest_frame, persist=True, classes=0, conf=0.7)

            for objects in detections:
                boxes = objects.boxes
                for box in boxes:
                    try:
                        id = box.id[0]
                    except TypeError:
                        continue

                    side = inside_or_outside(box, self.linepoints)
                    if side == "inside":
                        self.visible_inside += 1

                        count_condition, self.crossed_ids = footfall_condition(box, self.polygon, self.crossed_ids)
                        if count_condition:
                            self.entry_count += 1
                            save_data_in_database(latest_frame, box, id.item(), datetime.datetime.now())

                    else:  # outside
                        self.visible_outside += 1

                    
                    plot_bbox_withid(latest_frame, box, id)
            plot_roi(latest_frame, self.polygon, self.linepoints)
        self.latest_frame = latest_frame


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--cameras_json", type=str, default="cameras.json")
    parser.add_argument("--model", type=str, default="yolov8l-face.pt") # yolov8m.pt
    parser.add_argument("--fps", type=int, default=25)
    parser.add_argument("--roi_file", type=str, default="ROI.json")
    arguments = parser.parse_args()

    counter_obj = PeopleCounter(arguments)
    while True:
        counter_obj.run()
        
        # frame = np.squeeze(counter_obj.latest_frame)
        # cv2.imshow("frame",frame)
        # cv2.waitKey(1)
        