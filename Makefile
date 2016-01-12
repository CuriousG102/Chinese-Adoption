all: install-all collect-static migrate run-server

install-docker:
	wget -qO- https://get.docker.com/ | sh
	apt-get -y install python-pip
	pip install docker-compose
install-site:
	docker-compose build
install-all: install-docker install-site
run-server: docker-compose up
install-and-run: install-all run-server
collect-static:
	docker run --env-file=.env chineseadoption_web python /usr/src/app/adoption_stories/manage.py collectstatic --noinput
migrate:
	docker run --env-file=.env chineseadoption_web python /usr/src/app/adoption_stories/manage.py migrate
new-super-user:
	docker run --env-file=.env chineseadoption_web python /usr/src/app/adoption_stories/manage.py createsuperuser
