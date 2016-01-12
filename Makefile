all: install-all collect-static migrate run-server

install-docker:
	apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
	mkdir -p /etc/apt/sources.list.d/
	echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" > /etc/apt/sources.list.d/docker.list
	apt-get update
	apt-get purge -y lxc-docker
	apt-get install -y linux-image-extra-$(uname -r)
	apt-get install -y docker-engine
	service docker start
	curl -L https://github.com/docker/compose/releases/download/1.5.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
	chmod +x /usr/local/bin/docker-compose
install-site:
	docker-compose build
install-all: install-docker install-site
run-server: docker-compose up
install-and-run: install-all run-server
collect-static:
    docker run --env-file=.env adoptionwebsite_web python /usr/src/app/adoption_stories/manage.py collectstatic --noinput
migrate:
    docker run --env-file=.env adoptionwebsite_web python /usr/src/app/adoption_stories/manage.py migrate
new-super-user:
	docker run --env-file=.env adoptionwebsite_web python /usr/src/app/adoption_stories/manage.py createsuperuser
