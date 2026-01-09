.PHONY: start stop build destroy

start:
	docker compose --env-file .env up -d
	./n8n-init.sh

stop:
	docker compose down

build:
	docker compose build

destroy:
	docker compose down -v --remove-orphans
	sudo rm -rf ./supabase/volumes/db/data
