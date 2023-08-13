FROM jrottenberg/ffmpeg:5.0-alpine as ffmpeg
FROM node:16.14.2 as node

FROM ruby:2.7.7

# COPY --from=ffmpeg / /
COPY --from=node /usr/local/bin/ /usr/local/bin/

COPY --from=node /opt/ /opt/

EXPOSE 3000

CMD  ["bin/docker_setup"]
