import face_recognition
import cv2
import numpy as np
import os

def recognize_faces_from_camera():
    # Directory path containing the images of known faces
    images_path = "image_database"

    # Load images and encode faces
    known_face_encodings = []
    known_face_names = []
    for image_name in os.listdir(images_path):
        image_path = os.path.join(images_path, image_name)
        known_image = face_recognition.load_image_file(image_path)
        known_face_encoding = face_recognition.face_encodings(known_image)[0]
        known_face_encodings.append(known_face_encoding)
        known_face_names.append(os.path.splitext(image_name)[0])
    
    # Open video capture from the camera
    video_capture = cv2.VideoCapture(2)  # 0 is the default camera

    # Create a window to display the camera feed
    cv2.namedWindow('Camera Feed', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('Camera Feed', 640, 480)  # Optional: Resize the window

    while True:
        ret, frame = video_capture.read()
        if not ret:
            break

        # Find all the faces and face encodings in the frame
        face_locations = face_recognition.face_locations(frame)
        face_encodings = face_recognition.face_encodings(frame, face_locations)

        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

            if True in matches:
                first_match_index = matches.index(True)
                name = known_face_names[first_match_index]

            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
            cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.5, (255, 255, 255), 1)

        # Display the frame in the window
        cv2.imshow('Camera Feed', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the video capture and close all windows
    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    recognize_faces_from_camera()