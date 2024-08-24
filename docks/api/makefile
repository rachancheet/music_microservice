build:
	docker build . --tag express
run : 
	docker rm -f express
	# docker rm -f some-redis
	# docker run --name some-redis --network music_network -d redis redis-server --save 60 1 
	docker run --name express --network music_network -d -p 3001:3001 express 