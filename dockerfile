FROM python:3.11.4-alpine3.18


WORKDIR /app

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["flask", "--app", "run", "run", "--host=0.0.0.0"]

