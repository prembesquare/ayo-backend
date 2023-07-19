install:
	npm install
	npm init -y
	npm install express
	npm install pg
	npm install bcrypt
	npm install express-validator
	npm install jsonwebtoken
	npm install nodemailer
	npm install randomstring
	npm install redis

build:
	sudo docker-compose up --build

db:
	sudo docker exec -it ayo_drc_db psql -U postgres

down:
	sudo docker-compose down --volumes

clean:
	sudo docker-compose down --volumes
	sudo rm -rf postgres