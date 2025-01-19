provider "aws" {
  region = "us-east-2"  # Replace with your desired region

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

resource "aws_instance" "nextjs_instance" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t2.micro"  # Or another instance type as needed
  key_name               = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.nextjs_sg.id]

  user_data = templatefile("user_data.sh.tpl", {
    nextjs_repo_url = var.nextjs_repo_url
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
