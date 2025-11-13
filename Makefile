.PHONY: start stop build destroy

start:
	docker compose --env-file supabase/.env up -d

stop:
	docker compose down

build:
	docker compose build

destroy:
	docker compose down -v --remove-orphans
