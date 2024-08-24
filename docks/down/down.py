
from PIL import Image,ImageGrab
# import pywhatkit as kt
import pyautogui as pg
import time
import os
import urllib.request
import requests
from PIL import Image
import re
from bs4 import BeautifulSoup
import yt_dlp as youtube_dl
# import HTMLParser
# from autoscraper import Autoscraper
import pytesseract

# pytesseract.pytesseract.tesseract_cmd = r'Tesseract-OCR\tesseract'


def download(video_url):
	try:	
		video_info = youtube_dl.YoutubeDL().extract_info(
		url = video_url,download=False
		)
		filename = f"{video_info['title']}.mp3"
		options={
		'format':'bestaudio/best',
		'keepvideo':False,
		'outtmpl':f'music/{filename}',
		}
		with youtube_dl.YoutubeDL(options) as ydl:
			ydl.download([video_info['webpage_url']])
		# print(filename)
	except:
		print('not able to download')
 
	# print("Download complete... {}".format(filename))



def main():
	# test.png => location_of_image
		# path =f""
	for j in (os.listdir('pics')):
		img = Image.open("pics/{}".format(j))
		# img.show()
		w,h = img.size
		img = img.crop((0,500,w,2050))
		for i in range(9):
			if 190*(i+1)>h:
				# print("size wali bhackchodi")
				break
			im = img.crop((0,190*i,w,190*(i+1)))
			# im.show()
			name = pytesseract.image_to_string(im, lang="eng")
			print(name)
			video_url = get_video_url(name)
			download(video_url)

if __name__ =='__main__':
	main()