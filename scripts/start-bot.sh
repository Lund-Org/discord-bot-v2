#!/bin/bash
set -e

rm -rf /tmp/*
pnpm nx run bot:serve:production
