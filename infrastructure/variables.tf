variable "aws_region" {
  default = "us-east-1"
}
variable "aws_profile" {
  default = "space-center"
}
variable "envs" {
  type = "map"
  default = {
    "local" = "local"
    "dev" = "development"
    "prod" = "production"
  }
}

variable "api" {
  type = "map"
}
