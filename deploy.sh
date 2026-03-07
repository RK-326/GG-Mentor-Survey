#!/bin/bash
set -e

echo "=== SAT Focus Group Deploy ==="

# 1. Run migrations (connects to Neon directly)
echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Migrations applied."

# 2. Build and push Docker image
echo "Building Docker image..."
docker buildx build --platform linux/amd64 --provenance=false \
  -t 818034793268.dkr.ecr.us-east-1.amazonaws.com/sat-focus-group:latest \
  --push .
echo "Image pushed to ECR."

# 3. Deploy to EC2
echo "Deploying to EC2..."
ECR_PASSWORD=$(aws ecr get-login-password --region us-east-1)
ssh ubuntu@18.211.149.64 "\
  echo '$ECR_PASSWORD' | sudo docker login --username AWS --password-stdin 818034793268.dkr.ecr.us-east-1.amazonaws.com && \
  sudo docker pull 818034793268.dkr.ecr.us-east-1.amazonaws.com/sat-focus-group:latest && \
  sudo docker stop sat-focus-group 2>/dev/null; \
  sudo docker rm sat-focus-group 2>/dev/null; \
  sudo docker run -d \
    --name sat-focus-group \
    --restart unless-stopped \
    -p 3001:3000 \
    --env-file /opt/sat-focus-group.env \
    818034793268.dkr.ecr.us-east-1.amazonaws.com/sat-focus-group:latest"

echo "=== Deploy complete ==="
echo "Check: https://surveys.global-generations-edu.com/focus-group/"
