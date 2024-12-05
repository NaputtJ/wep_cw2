FROM ubuntu:20.04

RUN apt-get update

RUN apt-get update && apt-get install -y curl bash \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash \
    && /bin/bash -c "source ~/.nvm/nvm.sh && nvm install 22"

# RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
#     && apt-get install -y nodejs
#
# RUN python3 -m venv /venv
# RUN /venv/bin/pip install --upgrade pip
RUN apt-get update && apt-get install -y \
    software-properties-common \
    wget \
    curl \
    lsb-release

RUN add-apt-repository ppa:deadsnakes/ppa

RUN apt-get update && apt-get install -y python3.11 python3.11-distutils python3-pip

RUN ln -sf /usr/bin/python3.11 /usr/bin/python3


# RUN apt-get update && apt-get install -y \
#     python3.9 python3.9-distutils python3-pip \
#     tzdata \
#     && ln -sf /usr/bin/python3.9 /usr/bin/python3 \
#     && ln -sf /usr/bin/python3.9 /usr/bin/python \
#     && dpkg-reconfigure --frontend Noninteractive tzdata

WORKDIR /app

COPY ./requirements.txt .

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["flask", "--app", "run", "run", "--host=0.0.0.0"]

