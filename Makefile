.PHONY: start stop build destroy

start:
	docker compose --env-file .env up -d

stop:
	docker compose down

build:
	docker compose build

destroy:
	docker compose down -v --remove-orphans
	sudo rm -rf ./supabase/volumes/db/data
