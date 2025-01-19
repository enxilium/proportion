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

# Clone your Next.js application from the repository
git clone "${nextjs_repo_url}" nextjs-app
cd nextjs-app

# Build the Docker image
docker build -t nextjs-app .

# Run the Docker container
docker run -d -p 80:3000 --name nextjs-app nextjs-app

EOF
