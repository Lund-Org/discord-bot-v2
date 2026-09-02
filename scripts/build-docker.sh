#!/bin/bash

read -p "New version? " new_version

docker build -t maurice:$new_version -f config/Dockerfile .
