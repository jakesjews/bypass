#!/usr/bin/env bash

set -Eeo pipefail

docker compose -f docker/medplum-backend.yml up -d
docker compose -f docker/medplum-admin.yml up -d

