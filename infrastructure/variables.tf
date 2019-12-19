variable "aws_region" {
  default = "us-east-1"
}

variable "aws_profile" {
  default = "space-center"
}

variable "envs" {
  type = object({
    local = string,
    dev = string,
    prod = string
  })
  default = {
      local = "local"
      dev   = "development"
      prod  = "production"
    }
  
}

variable "api" {
  type = object({
    id = string,
    module = string,    
  })
}

variable "lambda" {
  type = object({
    role = string,
    name = string,    
    region = string,    
  })
}

