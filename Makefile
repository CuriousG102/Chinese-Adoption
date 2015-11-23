all:
    apt-get -y python3-dev libpq-dev libjpeg-dev
    virtualenv -p python3 venv
    venv/bin/pip install -r requirements.txt