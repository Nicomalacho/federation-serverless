provider "aws" {
  region = "${var.aws_region}"
  profile = "${var.aws_profile}"
}
terraform {
  backend "s3" {
    bucket = "space-center-deploy"
    key    = "federation/terraform.tfstate"
    region = "us-east-1"
  }
}
resource "aws_dynamodb_table" "federation-server" {
  name = "federation-server-${terraform.env}"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "domain"
  range_key      = "identification"

  attribute {
    name = "domain"
    type = "S"
  }

  attribute {
    name = "identification"
    type = "S"
  }

  tags {
    Name        = "federation"
    Service     = "space-center"
    Environment = "${terraform.env}"
  }
}
