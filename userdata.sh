#!/bin/bash
set -x
exec > /var/log/user-data.log 2>&1

echo "1. Configurando 4 GB Swap..."
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

echo "2. Instalando Docker, Docker Compose, Git y AWS CLI..."
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release unzip docker.io docker-compose-plugin awscli git
usermod -aG docker ubuntu
systemctl enable docker
systemctl start docker

echo "3. Clonando repositorio RecicLaGo..."
mkdir -p /home/ubuntu/reciclago
cd /home/ubuntu/reciclago
git clone https://github.com/kr0zapps/reciclago-cloud-nativo.git .
chown -R ubuntu:ubuntu /home/ubuntu/reciclago

echo "✅ Inicialización EC2 lista."
