# i have a folder full of photos that i want to compress
# i want to compress them from 1920x1080 to 1280x720 in one folder
# then i want to compress them from 1280x720 to 640x360 in another folder

import os
from PIL import Image
import tqdm

# get the current working directory
cwd = os.getcwd()

# path is /public/images
# this is the path to the folder with all of the original photos
path = cwd + '/public/animation_3/1920x1080'
# print length of the folder
print(len(os.listdir(path)))

# each photo is "A_000.png", "A_001.png", ..., "A_637.png"
# each photo is 1920x1080
# i want to compress them to 1280x720
# and save them in a new folder called "1280x720"
# so the new photos will be "A_000.png", "A_001.png", ..., "A_637.png"

# create a new folder called with the following name
# (should be image dimensions ideally)
new_folder = "public/animation_3/640x360"
os.mkdir(new_folder)

# loop through each photo using tqdm
for i in tqdm.tqdm(range(0, 1215)):
    try:
        # get the photo name
        photo_name = 'AB_' + str(i).zfill(4) + '.png'
        # open the photo
        photo = Image.open(path + '/' + photo_name)
        # resize the photo
        resized_photo = photo.resize((640, 360))
        # save the photo in the new folder
        resized_photo.save(new_folder + '/' + photo_name)
    except:
        # if there is an error, save a blank photo
        blank_photo = Image.new('RGB', (640, 360), (255, 255, 255))
        blank_photo.save(new_folder + '/' + photo_name)
        

