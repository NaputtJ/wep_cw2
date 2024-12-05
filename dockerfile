FROM python:3.11.4-alpine3.18


RUN apk update && \
    apk add --no-cache build-base gcc g++ gfortran libatlas && \
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["flask", "--app", "run", "run", "--host=0.0.0.0"]

