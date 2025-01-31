terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-2"  # Replace with your desired region
}

resource "tls_private_key" "rsa-4096" {
  algorithm = "RSA"
  rsa_bits  = 4096
} 


resource "aws_key_pair" "deployer" {
  key_name   = var.key_pair_name
  public_key = tls_private_key.rsa-4096.public_key_openssh
}


variable "key_pair_name" {
  description = "Name of the existing AWS Key Pair"
}

variable "my_ip" {
  description = "Your public IP address with CIDR notation"
}

variable "nextjs_repo_url" {
  description = "Git repository URL for your Next.js application"
}

variable "AUTH0_SECRET" {
  description = "Auth0 secret"
}

variable "AUTH0_CLIENT_SECRET" {
  description = "Auth0 client secret"
}

variable "aws_region" {
  description = "AWS region"
  default     = "us-east-2"
}

# Create an ECR repository to store your Docker images
resource "aws_ecr_repository" "nextjs_app" {
  name = "nextjs-app"
  force_delete = true
}

resource "aws_security_group" "nextjs_sg" {
  name        = "nextjs_sg"
  description = "Security group for Next.js application"

  ingress {
    description = "SSH access from trusted IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]
  }

  ingress {
    description = "HTTP access from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Next.js port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Use Ubuntu 22.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical (Ubuntu) AWS account ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Create IAM role and policy for EC2 to access ECR
resource "aws_iam_role" "ec2_ecr_access" {
  name = "ec2_ecr_access"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_policy" {
  role       = aws_iam_role.ec2_ecr_access.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_instance_profile" "ec2_ecr_access" {
  name = "ec2_ecr_access"
  role = aws_iam_role.ec2_ecr_access.name
}

resource "aws_instance" "proportionTerraformEC2" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t2.micro"
  key_name               = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.nextjs_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_ecr_access.name

  user_data = templatefile("user_data.sh.tpl", {
    nextjs_repo_url = var.nextjs_repo_url
    region         = var.aws_region
    ecr_repo_url   = aws_ecr_repository.nextjs_app.repository_url
    auth0_secret = var.AUTH0_SECRET
    auth0_client_secret = var.AUTH0_CLIENT_SECRET
  })

  tags = {
    Name = "Next.js Docker Instance"
  }
}


output "instance_public_ip" {
  description = "Public IP address of the Next.js EC2 instance"
  value       = aws_instance.nextjs_instance.public_ip
}


output "instance_public_dns" {
  description = "Public DNS of the Next.js EC2 instance"
  value       = aws_instance.nextjs_instance.public_dns
}
