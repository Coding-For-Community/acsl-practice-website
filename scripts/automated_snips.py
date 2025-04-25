"""
This is a script that allows you to take a lot of snips at once, while saving them as images
within this directory.
Use this to copy down an entire page of ACSL problems and their solutions.

IMPORTANT: to run this script, run `pip install Pillow` and `pip install keyboard` first.
""" 
import time
import keyboard
from PIL import ImageGrab

STARTING_NUM: int = 1

def save_clipboard_image(img_num: int) -> int:
    keyboard.press_and_release('windows+shift+s')
    keyboard.wait('shift')
    image = ImageGrab.grabclipboard()
    if image:
        filepath = f"{img_num}.png"
        image.save(filepath)
        print(f"Image saved: {filepath}")
        return img_num + 1
    else:
        print("No image found in clipboard.")
        return img_num

if __name__ == "__main__":
    time.sleep(5)
    curr_num: int = STARTING_NUM
    while True:
        curr_num = save_clipboard_image(curr_num)