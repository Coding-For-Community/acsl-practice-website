# to run this script, run `pip install Pillow` and `pip install pynput` first.
import time
from PIL import ImageGrab
from pynput.keyboard import Controller, Key

keyboard = Controller()
STARTING_NUM: int = 34

def save_clipboard_image(img_num: int) -> int:
    keyboard.press(Key.print_screen)
    keyboard.release(Key.print_screen)
    time.sleep(6)  # Adjust the interval as needed
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