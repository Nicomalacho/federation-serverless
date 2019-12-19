/* 
  use the default key as example to add your own
 */

# default api key
resource "aws_api_gateway_api_key" "default-key" {
  name = "defaultKey"
}

# assign the default key to federation server usage plan
resource "aws_api_gateway_usage_plan_key" "federation-server-usage-key" {
  key_id        = "${aws_api_gateway_api_key.default-key.id}"
  key_type      = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.federation-server-plan.id}"
}

#output the default key
output "default-key" {
  value = "aws_api_gateway_api_key.default-key.value "
}

/* add your keys below this line
<----------------------------------------------------------------------------->
 */
/* 
resource "aws_api_gateway_usage_plan_key" "main" {
  key_id        = "${aws_api_gateway_api_key.mykey.id}"
  key_type      = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.myusageplan.id}"
} */