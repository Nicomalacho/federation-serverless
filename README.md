# Federation server
The Stellar [Federation](https://www.stellar.org/developers/learn/concepts/federation.html) protocol allows you to convert a human-readable address like amy*your_org.com to an account ID. It also includes information about what should be in a transaction’s memo. When sending a payment, you contact a federation server first to determine what Stellar account ID to pay. Luckily, the bridge server does this for you.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Terraform](https://www.terraform.io/)
* [Claudiajs](https://claudiajs.com/)
* [AWS Account](https://aws.amazon.com)
* [AWS Credentials with \[space-center\] Profile](http://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html)

## Installation / Initial setup

* `git clone git@gitlab.com:space-center/federation-serverless.git`
* change into the new directory
* `npm run api:create` creates and deploy claudiajs api with dev environment
* `npm run db:init` init terraform
* `npm run db:setup:workspaces` create terraform workspaces
* `npm run db:plan` plan dev infrastructure
* `npm run db:apply` creates or updates dev infrastructure
* if you are doing a fresh setup please configure [remote proxy](https://github.com/graphcool/chromeless/tree/master/serverless) and then update Chromeless Service Information in [settings.js](api/repositories/settings.js)

## Running on local machine
* `npm server` start claudia js in local machine

### Testing
* `npm test` run tests with jasmine

## Create your own api keys
* go to /infrastructure/apiKeys
* add your keys as many as you need

## Deploying
### Deploying dev

* `npm run db:plan` verify changes in dev infrastructure (optional)
* `npm run db:apply` apply changes to dev infrastructure (optional)
* `npm run api:deploy` deploy claudiajs api with dev environment

### Deploying prod

* `npm run db:plan:prod` verify changes in prod infrastructure (optional)
* `npm run db:apply:prod` apply changes to prod infrastructure (optional)
* `npm run api:deploy:prod` deploy claudiajs api with prod environment




