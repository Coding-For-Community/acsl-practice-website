"""
This is a script that allows you to take a lot of snips at once, while saving them as images
within this directory. Use this to copy down an entire page of ACSL problems and their solutions.

Make sure to install requirements (pip install -r scripts/requirements.txt) before running this.
""" 

import keyboard
from PIL import ImageGrab

STARTING_NUM: int = 1

def save_clipboard_image(img_num: int) -> bool:
    keyboard.press_and_release('windows+shift+s')
    keyboard.wait('shift')
    image = ImageGrab.grabclipboard()
    if image:
        filepath = f"{img_num}.png"
        image.save(filepath)
        print(f"Image saved: {filepath}")
        return True
    else:
        print("No image found in clipboard.")
        return False

if __name__ == "__main__":
    curr_num: int = STARTING_NUM
    keyboard.wait('shift')
    while True:
        curr_num += save_clipboard_image(curr_num)