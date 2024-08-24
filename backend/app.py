from PIL import Image,ImageGrab
# import pywhatkit as kt
# import pyautogui as pg
import time
import os
# import urllib.request
import requests
# from PIL import Image
# import re
from bs4 import BeautifulSoup
# import yt_dlp as youtube_dl
# import HTMLParser
# from autoscraper import Autoscraper
import pytesseract
import redis

# pytesseract.pytesseract.tesseract_cmd = r'Tesseract-OCR\tesseract'

def get_video_url(name):
	try:
		url =f"https://www.youtube.com/results?search_query={name.replace(' ','+')}+full+audio"
		soup = BeautifulSoup(requests.get(url).content,'html.parser').prettify()
		# print(soup.find_all('script'))
		link = soup.split('{"videoId":"')[1]
		link = link.split('","thumbnail"')[0]
		return link
	except:
		print(f'skipped {name}')
		return ""



def dothething(path):
	# test.png => location_of_image
		# path =f""
	img = Image.open(path)
	# img.show()
	w,h = img.size
	img = img.crop((0,500,w,2050))
	ans= ""
	# name = ""
	for i in range(9):
		if 190*(i+1)>h:
			print("size wali bhackchodi")
			break
		im = img.crop((0,190*i,w,190*(i+1)))
		# im.show()
		name = pytesseract.image_to_string(im, lang="eng")
		print(name)
		a = get_video_url(name)
		if a != "":
			ans+=a+","
		# video_url = get_video_url(name)
		# download(video_url)
	return ans


def main():
	r = redis.Redis(host='localhost', port=6379, decode_responses=True)
	print("redis connected")
	while(1):
		res = r.brpop("music_que_1")[1]
		print("msg recived")
		group_id = res[:res.find("_")]
		imgpath = "uploads/imgs/"+res
		print("Going to do ", res)
		links = dothething(imgpath)
		print("Done with ", links)
		r.lpush("music_que_2",group_id+":"+links)



if __name__ =='__main__':
	main()










