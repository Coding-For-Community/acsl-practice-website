FROM python:3.12-slim
RUN python -m venv
RUN source venv/bin/activate
WORKDIR /scripts
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY create_folders.py create_folders.py
RUN python create_folders.py
WORKDIR /backend
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD python main.py

FROM node:22-alpine
RUN npm install
CMD npm run dev