# Portfolio web app image: static files served by nginx on Alpine Linux.
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="sysad2-portfolio" \
      org.opencontainers.image.description="Static group portfolio for System Administration 2"

# Values the run playbook can override per host with `docker run -e ...`.
# The nginx image runs envsubst on /etc/nginx/templates/*.template at startup.
ENV SERVED_BY=unknown-host \
    CONTAINER_NAME=portfolio

# Remove the default welcome page and config, then add ours.
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY app/ /usr/share/nginx/html/

EXPOSE 80

# Docker marks the container unhealthy if nginx stops answering.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
