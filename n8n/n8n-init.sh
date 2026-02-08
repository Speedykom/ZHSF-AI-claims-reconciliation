#!/bin/bash

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${BLUE}"
echo " ███████╗██████╗ ███████╗███████╗██████╗ ██╗   ██╗██╗  ██╗ ██████╗ ███╗   ███╗"
echo " ██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗╚██╗ ██╔╝██║ ██╔╝██╔═══██╗████╗ ████║"
echo " ███████╗██████╔╝█████╗  █████╗  ██║  ██║ ╚████╔╝ █████╔╝ ██║   ██║██╔████╔██║"
echo " ╚════██║██╔═══╝ ██╔══╝  ██╔══╝  ██║  ██║  ╚██╔╝  ██╔═██╗ ██║   ██║██║╚██╔╝██║"
echo " ███████║██║     ███████╗███████╗██████╔╝   ██║   ██║  ██╗╚██████╔╝██║ ╚═╝ ██║"
echo " ╚══════╝╚═╝     ╚══════╝╚══════╝╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝"
echo "                                                                                 "
echo "  ██████╗ ██████╗  ██████╗ ██╗   ██╗██████╗                                    "
echo " ██╔════╝ ██╔══██╗██╔═══██╗██║   ██║██╔══██╗                                   "
echo " ██║  ███╗██████╔╝██║   ██║██║   ██║██████╔╝                                   "
echo " ██║   ██║██╔══██╗██║   ██║██║   ██║██╔═══╝                                    "
echo " ╚██████╔╝██║  ██║╚██████╔╝╚██████╔╝██║                                        "
echo "  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝                                        "
echo -e "${NC}"

N8N_DATA_PATH="/home/external"

echo "initializing n8n..."
sleep 15

CONTAINER_NAME=$(docker ps --filter "name=n8n" --format "{{.Names}}" | head -1)

if [ -z "$CONTAINER_NAME" ]; then
    echo "error: could not find running n8n container"
    exit 1
fi

echo -e "${GREEN}[1/3]${NC} uploading secrets..."
docker exec "$CONTAINER_NAME" n8n import:credentials --input="$N8N_DATA_PATH/credentials.json" > /dev/null 2>&1

echo -e "${GREEN}[2/3]${NC} uploading workflows..."
docker exec "$CONTAINER_NAME" n8n import:workflow --input="$N8N_DATA_PATH/AGENTIC-MCP-claims-rec.json" > /dev/null 2>&1
docker exec "$CONTAINER_NAME" n8n import:workflow --input="$N8N_DATA_PATH/RAG-OCR-workflow.json" > /dev/null 2>&1

echo -e "${GREEN}[3/3]${NC} activating workflows in production..."
WORKFLOW_LIST=$(docker exec "$CONTAINER_NAME" n8n list:workflow 2>/dev/null)

WORKFLOW1_ID=$(echo "$WORKFLOW_LIST" | grep "AGENTIC-MCP-CLAIMS-REC" | cut -d'|' -f1)
WORKFLOW2_ID=$(echo "$WORKFLOW_LIST" | grep "RAG-OCR-workflow" | cut -d'|' -f1)

if [ -n "$WORKFLOW1_ID" ]; then
    docker exec "$CONTAINER_NAME" n8n update:workflow --id="$WORKFLOW1_ID" --active=true > /dev/null 2>&1
fi

if [ -n "$WORKFLOW2_ID" ]; then
    docker exec "$CONTAINER_NAME" n8n update:workflow --id="$WORKFLOW2_ID" --active=true > /dev/null 2>&1
fi

docker restart "$CONTAINER_NAME" > /dev/null 2>&1
sleep 15

echo "✓ initialization completed successfully"