FROM python:3.12-slim
RUN python -m venv
RUN source venv/bin/activate
WORKDIR /backend
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD python main.py