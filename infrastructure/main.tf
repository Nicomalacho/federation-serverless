provider "aws" {
  version = "~> 2.0"
  region  = var.aws_region
  profile = var.aws_profile
}

/* terraform {
  backend "s3" {
    bucket = "space-center-deploy-test"
    key    = "federation/terraform.tfstate"
    region = "us-east-1"
  }
} */
resource "aws_dynamodb_table" "federation-server" {
  name           = "federation-server-${terraform.workspace}"
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

  attribute {
    name = "account_id"
    type = "S"
  }

  global_secondary_index {
    name            = "account_id_index"
    hash_key        = "account_id"
    write_capacity  = 10
    read_capacity   = 10
    projection_type = "ALL"
  }

  tags = {
    Name        = "federation"
    Service     = "space-center"
    Environment = "terraform.workspace"
  }
}

resource "aws_api_gateway_usage_plan" "federation-server-plan" {
  name        = "federation-server-plan-${terraform.workspace}"
  description = "Federation server usage plan"

  api_stages {
    api_id = var.api.id
    stage  = "${lookup(var.envs, terraform.workspace)}"
  }

  quota_settings {
    limit  = 172800
    period = "DAY"
  }

  throttle_settings {
    burst_limit = 10
    rate_limit  = 20
  }
}

