#!/bin/bash
# Update and install required packages
apt update -y
apt upgrade -y
apt install -y docker.io git

# Start and enable Docker service
systemctl start docker
systemctl enable docker

# Add the ubuntu user to the docker group
usermod -aG docker ubuntu

# Switch to the ubuntu user
su - ubuntu <<'EOF'

git clone "${nextjs_repo_url}" nextjs-app
cd nextjs-app/front-end
npm install
npm run build

INSTANCE_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Build the Docker image
docker build -t nextjs-app .

# Run the Docker container
docker run -d \
  -e AUTH0_SECRET='${auth0_secret}' \
  -e APP_BASE_URL="http://$INSTANCE_IP" \
  -e AUTH0_CLIENT_SECRET='${auth0_client_secret}' \
  -p 80:3000 \
  --name nextjs-app nextjs-app

EOF
