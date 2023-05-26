FROM --platform=linux/amd64 grafana/k6
COPY script.js ./script.js
ENTRYPOINT ["k6", "run" "script.js"]