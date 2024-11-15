#!/bin/bash

images=$(docker images --format "{{.Repository}}:{{.Tag}}")

for image in $images; do
  echo "Scanning: $image"
  docker scout cves $image
done
