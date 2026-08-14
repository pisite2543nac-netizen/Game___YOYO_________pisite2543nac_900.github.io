#!/usr/bin/env bash
set -e
firebase use thc-nr
cd functions
npm install
cd ..
firebase deploy --only functions
