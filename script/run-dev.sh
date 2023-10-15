#!/bin/bash

script_name="$0"
script_full_path=$(dirname "$0")

show_help() {
    echo "Usage: $script_name [options] [docker compose options]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Display this help message."
    echo "  --apps-only         Start only app containers (web, prerender)."
    echo "  --workers-only      Start only worker container(s)."
    echo "  --separate-workers  Run each worker in seperate container (takes >10min to build)."
    echo ""
    echo "Docker compose options: (are forwarded to docker)"
    echo "  -build              Rebuild all containers."
    echo "  -d                  Start containers in detached mode."
    echo ""
    echo "  docker compose --help to see all available options."
}

cd "$script_full_path/../docker"

apps_only=false
workers_only=false
separate_workers=false
internal_compose_args=""
external_compose_args=""

# Parse the options
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            show_help
            exit 0
            ;;
        --apps-only)
            apps_only=true
            ;;
        --workers-only)
            workers_only=true
            ;;
        --separate-workers)
            separate_workers=true
            ;;
        *)
            external_compose_args=$1
            ;;
    esac
    shift
done


if $apps_only && $workers_only; then
    echo "Invalid argument: Run either only apps or only workers."
    exit 1
fi

if $apps_only && $separate_workers; then
    echo "Warning: --separate-workers doesn't do anything when running only apps."
fi


apps_args="-f docker-compose.apps.yml"
worker_args="-f docker-compose.all-workers.yml"

if $separate_workers; then
    worker_args="-f docker-compose.workers.yml"
fi

if $apps_only; then
    internal_compose_args=$apps_args
elif $workers_only; then
    internal_compose_args=$worker_args
else
    internal_compose_args="$apps_args $worker_args"
fi


docker compose $internal_compose_args $external_compose_args -p hey up --remove-orphans

