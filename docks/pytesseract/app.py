from PIL import Image,ImageGrab
# import time
# import os
import requests
from bs4 import BeautifulSoup
import pytesseract
import redis
import time



def get_video_url(name):
	try:
		url =f"https://www.youtube.com/results?search_query={name.replace(' ','+')}+full+audio"
		soup = BeautifulSoup(requests.get(url).content,'html.parser').prettify()
		
		link = soup.split('{"videoId":"')[1]
		link = link.split('","thumbnail"')[0]
		return link
	except:
		print(f'skipped {name}')
		return ""



def dothething(path):
	try: 
		img = Image.open(path)
		w,h = img.size
		img = img.crop((0,500,w,2050))
		ans= ""
		for i in range(9):
			if 190*(i+1)>h:
				print("Image scale issue found")
				break
			im = img.crop((0,190*i,w,190*(i+1)))
			
			name = pytesseract.image_to_string(im, lang="eng")
			print(name)
			a = get_video_url(name)
			if a != "":
				ans+=a+","
	except:
		print("Invalid Path")
		return ""
		
	return ans


def main():
	con = False
	while not con:
		try :
			r = redis.Redis(host='some-redis', port=6379, decode_responses=True)
			r.ping()
			con = True
			print("redis connected")
		except:
			print("reddis connection attempt failed retrying in 5 seconds")
			time.sleep(5)
	while True :
		res = r.brpop("music_que_1")[1]
		print("msg recived")
		group_id = res[:res.find("_")]
		imgpath = "uploads/imgs/"+res
		print("Going to do ", res)
		links = dothething(imgpath)
		if links != "":
			print("Done with ", links)
			r.lpush("music_que_2",group_id+":"+links)



if __name__ =='__main__':
	main()










