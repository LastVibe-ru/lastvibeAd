FROM ubuntu:latest
LABEL authors="chino"

ENTRYPOINT ["top", "-b"]