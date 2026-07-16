# Cloud Commercial Holdings LLC Website

FastAPI + Jinja2 site for Cloud Commercial Holdings LLC. Static assets and HTML templates are served via Starlette.

## Requirements
- Python 3.9+
- make (optional, for convenience targets)

## Quickstart (Make)
```bash
make run
```
This will:
- Create a virtual environment at `.venv`
- Upgrade `pip`/`setuptools`/`wheel`
- Install dependencies from `requirements.txt`
- Start the dev server with reload at `http://127.0.0.1:8000`

Use a different port:
```bash
PORT=8001 make run
```

## Manual setup (no Make)
```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

## Routes
- / — Home
- /services
- /about
- /contact
- /blog
- /AI
- /privacy-policy

## Project structure
```
app/
  main.py            # FastAPI app
  static/            # CSS, JS, images, icons
  templates/         # Jinja2 HTML templates
requirements.txt
README.md
Makefile
```

## Notes
- Stop the server with Ctrl+C in the terminal where it is running.
- If port 8000 is in use, run with `PORT=8001 make run` or change the `--port` flag.
- For deployment, you can run Uvicorn or Gunicorn+Uvicorn workers behind a reverse proxy (Nginx/Caddy).
