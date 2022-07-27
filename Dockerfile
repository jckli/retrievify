FROM python:3.9-bullseye

RUN mkdir /app
WORKDIR /app
COPY . .
RUN apt-get clean \
    && apt-get -y update
RUN apt-get -y install nginx \
    && apt-get -y install python3-dev \
    && apt-get -y install build-essential
RUN pip install -r requirements.txt
COPY nginx.conf /etc/nginx
RUN chmod +x ./start.sh
EXPOSE 80
CMD ["./start.sh"]