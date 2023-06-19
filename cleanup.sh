#!/bin/bash

#down the volume
sudo docker-compose down --volumes

#remove folder
sudo rm -rf postgres
