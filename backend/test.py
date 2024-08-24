
import yt_dlp as youtube_dl
def download(video_url):
	filename = ""
	# try:	
	video_info = youtube_dl.YoutubeDL().extract_info(
	url = video_url,download=False
	)
	filename = f"{video_info['title']}.mp3"
	options={
	'format':'bestaudio/best',
	'keepvideo':False,
	'outtmpl':f'music4/{filename}',
	}
	with youtube_dl.YoutubeDL(options) as ydl:
		ydl.download([video_info['webpage_url']])
		# print(filename)
	# except:
	# 	print('not able to download')
 

download("https://www.youtube.com/watch?v=ejYe2GwBEJ0")