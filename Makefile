PYTHON_BIN ?= python3
VENV_DIR ?= .venv
PYTHON := $(VENV_DIR)/bin/python
PIP := $(VENV_DIR)/bin/pip
UVICORN := $(VENV_DIR)/bin/uvicorn
HOST ?= 127.0.0.1
PORT ?= 8000

.PHONY: run install venv jekyll-build clean

$(VENV_DIR)/bin/python:
	$(PYTHON_BIN) -m venv $(VENV_DIR)

venv: $(VENV_DIR)/bin/python

install: venv
	$(PYTHON) -m pip install --upgrade pip setuptools wheel
	$(PIP) install -r requirements.txt
	bundle install

jekyll-build:
	bundle exec jekyll build

run: install jekyll-build
	$(UVICORN) app.main:app --host $(HOST) --port $(PORT) --reload

clean:
	rm -rf $(VENV_DIR) _site .jekyll-metadata .jekyll-cache
