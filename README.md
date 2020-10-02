# Ampled Web

Generated with [Raygun](https://github.com/carbonfive/raygun).

- [Ampled Web](#ampled-web)
  - [Getting Started](#getting-started)
    - [Access to shared tools](#access-to-shared-tools)
    - [Development requirements](#development-requirements)
    - [First Time Setup](#first-time-setup)
      - [`bin/setup`](#binsetup)
      - [`.env`](#env)
    - [Running the Specs](#running-the-specs)
    - [Running the Application Locally](#running-the-application-locally)
    - [Running Sidekiq](#running-sidekiq)
  - [Conventions](#conventions)
    - [Git](#git)
    - [Code Style](#code-style)
  - [Additional/Optional Development Details](#additionaloptional-development-details)
    - [Backup/Restore Database](#backuprestore-database)
    - [Code Coverage](#code-coverage)
    - [Using Guard](#using-guard)
    - [Using Mailcatcher](#using-mailcatcher)
    - [Using ChromeDriver](#using-chromedriver)
    - [Continuous Integration/Deployment with CircleCI and Heroku](#continuous-integrationdeployment-with-circleci-and-heroku)
- [Deploy to Acceptance/Production](#deploy-to-acceptanceproduction)
- [Database migrations and rollbacks](#database-migrations-and-rollbacks)
- [Server Environments](#server-environments)
    - [Hosting](#hosting)
    - [Environment Variables](#environment-variables)
    - [Third Party Services](#third-party-services)
    - [Using the Stripe CLI to test webhooks locally](#using-the-stripe-cli-to-test-webhooks-locally)
- [Internal Tools](#internal-tools)
  - [`application-fee-management`](#application-fee-management)
    - [Installation & setup](#installation--setup)
    - [Use](#use)

## Getting Started

### Access to shared tools

If you plan to do work in this repo, you probably want to get access to, at least:
* Ampled's Trello boards.
  * Used to track our work, and communicate with each other about status and implementation plans.
  * We like to talk about "card numbers", which don't show up in the Trello interface. You can see these with browser plugins,
    such as [this one for Chrome](https://chrome.google.com/webstore/detail/trello-card-numbers/kadpkdielickimifpinkknemjdipghaf) or [this one for Firefox](https://addons.mozilla.org/en-US/firefox/addon/trello-super-powers/).
* Heroku environments.
  * We run our servers on Heroku, where we have "production" and "acceptance" environments.
  * The "acceptance" environment will be helpful for getting credentials for services needed to
    run a server locally, and to debug things during QA.

Ask other devs in the Slack to get access to these services.

### Development requirements

To run the specs or fire up the server, be sure you have these installed (and running):

- Ruby 2.5 (see [.ruby-version](.ruby-version)).
- PostgreSQL 10.3+ (`brew install postgresql`).
- Heroku CLI (`brew tap heroku/brew && brew install heroku`).
- ffmpeg (`brew install ffmpeg`)

### First Time Setup

#### `bin/setup`

After cloning, run [./bin/setup](bin/setup) to install missing gems and prepare the database.

#### `.env`

The `bin/setup` script will create `.env` and `client/.env` files that define settings for your local environment. Do not check this into source control. Refer to the [environment variables](#environment-variables) section below for what can be specified in `.env`.

### Running the Specs

To run all Ruby and Javascript specs.

    $ ./bin/rake

Note: `./bin/rake` runs the springified version of rake (there's a `./bin/rspec` and `./bin/rails` too). You can add
`./bin` to your PATH too, then you'll always use the springified bins when they exist. See
[rails/spring](https://github.com/rails/spring) for additional information.

Note: Sidekiq jobs are [queued in memory](https://github.com/ampled-music/ampled-web/blob/development/spec/spec_helper.rb#L22) in the test environment.

### Running the Application Locally

First you need to install all npm dependencies in both root as well as client.

    $ yarn install
    $ cd client
    $ yarn install

Back in the root directory migrate the database

    $ bundle exec rake db:migrate

Then populate database with faker data.

    $ bundle exec rake dummy:admin
    $ bundle exec rake dummy:users
    $ bundle exec rake dummy:artist_pages
    $ bundle exec rake dummy:posts

The `dummy:admin` task will create an admin account with a well-known username and password, which can be used to give admin owers to other testing accounts via the admin dashboard. See the contents of [dummy.rake](lib/tasks/dummy.rake) for the username and password of this account.

Once your database is set up and filled with data simply run the following command and give it a moment to spin up a local test environment.

    $ npm run start

This will also automatically compile any js or css changes live on the fly.

### Running Sidekiq

By default Sidekiq jobs are [run inline](https://github.com/ampled-music/ampled-web/blob/development/config/environments/development.rb#L88-L90) in the development environment.

If you want to simulate the production environment by running jobs in the background, you need to run Redis and Sidekiq.

    $ brew services start redis
    $ bundle exec sidekiq

Then when starting your application server or console set the rails env to production.

    $ RAILS_ENV=production bundle exec rails console
    $ RAILS_ENV=production npm run start


## Conventions

### Git

- Branch `development` is auto-deployed to acceptance.
- Branch `master` is auto-deployed to production.
- Create feature branches off of `development` using the naming convention
  `(features|chores|bugs)/a-brief-description-######`, where ###### is the tracker id.
- Rebase your feature branch before merging into `development` to produce clean/compact merge bubbles.
- Always retain merge commits when merging into `development` (e.g. `git merge --no-ff branchname`).
- Use `git merge development` (fast-forward, no merge commit) from `master`.
- Craft atomic commits that make sense on their own and can be easily cherry-picked or reverted if necessary.

### Code Style

Rubocop is configured to enforce the style guide for this project.

On the client-side, the default `react-scripts` eslint configuration is ran during the build process. There is also an additional custom `.eslintrc.js` configuration in `client/`, but this is not enforced (as of May 2020). You can run the custom lint configuration with `yarn lint` (add `--fix` to the command, if you want to auto-fix errors).

## Additional/Optional Development Details

### Backup/Restore Database

To backup your postgres database run:

    $ bundle exec rake db:dump[backup_name]

To restore run:

    $ bundle exec rake db:restore[backup_name]

The backup files are stored in `/db/backups/` directory. If you use zsh, your rake task parameter brackets must be escaped.

IMPORTANT: These commands will connect to whatever DB your rails environment is configured with.

### Code Coverage

To compute code coverage for the Ruby specs, set the `COVERAGE` env variable:

    $ COVERAGE=true rspec

SimpleCov will output the coverage information into the `coverage/` directory. Open `coverage/index.html` to browse the
coverage results.

### Using Guard

Guard is configured to run ruby specs, and also listen for livereload connections.

    $ bundle exec guard

### Using Mailcatcher

    $ gem install mailcatcher
    $ mailcatcher
    $ open http://localhost:1080/

Learn more at [mailcatcher.me](http://mailcatcher.me/). And please don't add mailcatcher to the Gemfile.

### Using ChromeDriver

The ChromeDriver version used in this project is maintained by the [chromedriver-helper](https://github.com/flavorjones/chromedriver-helper) gem. This is means that the
feature specs are not running against the ChromeDriver installed previously on the machine, such as by Homebrew.

If you encounter issues related to the chromedriver version, e.g

    Selenium::WebDriver::Error::UnknownError:
      unknown error: call function result missing 'value'
        (Session info: headless chrome=69.0.3497.100)
        (Driver info: chromedriver=2.34.522932 (4140ab217e1ca1bec0c4b4d1b148f3361eb3a03e),platform=Mac OS X 10.13.6 x86_64)

you can update to the latest with executables from `chromedriver-helper`:

    $ chromedriver-update  # defaults to latest version of Chromedriver

refer to documentation for setting specific versions.

### Continuous Integration/Deployment with CircleCI and Heroku

This project is configured for continuous integration with CircleCI, see [.circleci/config.yml](.circleci/config.yml) for details.

On successful builds, Heroku will trigger a deployment via its
[GitHub Integration](https://devcenter.heroku.com/articles/github-integration#automatic-deploys).

# Deploy to Acceptance/Production

1. Pull Request into Acceptance/Production and run merge will trigger CI

The release process on Heroku will automatically run database migrations after the new
app version is built, but before it is deployed to users. This is controlled via the `release`
command in our app's [Procfile](Procfile).

# Database migrations and rollbacks

Database migrations run automagically ✨ in staging and production as part of the deploy process.
If you ever need to run a migration or a migration rollback in a Heroku environment, you can
do so using the `heroku run` command (part of the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)), like this:

```bash
$ heroku run rake db:migrate --app ampled-web
```

Or, for example, to roll back the most recent migration:

```bash
$ heroku run rake db:rollback --app ampled-web
```

(replace the app name above with `ampled-web-production` if you need to run this against production)

# Server Environments

### Hosting

Acceptance and Production are hosted on Heroku under the [ampled-music](https://dashboard.heroku.com/teams/ampled-music/apps) account.

### Environment Variables

Several common features and operational parameters can be set using environment variables.

If you need some of these credentials for local development, you can get the keys from the environment settings in the Heroku acceptance environment.

**Required**

- `S3_BUCKET` - AWS S3 bucket name. You can set this to `ampled-test` for local development.
- `DEVISE_JWT_SECRET_KEY` - Secret key for verifying JWT tokens. Required if you want to be able to log into your local app.

**Optional**

- `HOSTNAME` - Canonical hostname for this application. Other incoming requests will be redirected to this hostname.
- `FORCE_SSL` - Require all requests to come over a secure connection (default: false).
- `BASIC_AUTH_PASSWORD` - Enable basic auth with this password.
- `BASIC_AUTH_USER` - Set a basic auth username (not required, password enables basic auth).
- `RACK_TIMEOUT_SERVICE_TIMEOUT` - Terminate requests that take longer than this time (default: 15s).
- `ASSET_HOST` - Asset host for static assets (e.g. CDN) (default: none).
- `PORT` - Port to listen on (default: 3000).
- `WEB_CONCURRENCY` - Number of puma workers to spawn (default: 1).
- `RAILS_MAX_THREADS` - Threads per worker (default: 5).
- `DB_POOL` - Number of DB connections per pool (i.e. per worker) (default: RAILS_MAX_THREADS or 5).
- `RAILS_LOG_TO_STDOUT` - Log to standard out, good for Heroku (default: false).
- `RAILS_SERVE_STATIC_FILES` - Serve static assets, good for Heroku (default: false).
- `RAVEN_DSN` - used to support [Sentry](sentry.io) on the backend.
- `STRIPE_WEBHOOK_SECRET` - signing secret for main Stripe webhook. In your local environment, with the Stripe CLI you can find the endpoint's secret by running `stripe listen`
- `STRIPE_CONNECT_WEBHOOK_SECRET` - signing secret for Stripe Connect webhook. In your local environment, with the Stripe CLI you can find the endpoint's secret by running `stripe listen`
- `RAILS_ENV` - `production` in production, manually set to `acceptance` on acceptance environment, and `development` when running locally.

**Client .env**

- `REACT_APP_RAVEN_DSN` - used to support [Sentry](sentry.io) on the frontend.
- `REACT_APP_STRIPE_API_KEY` - Stripe API key

### Third Party Services

- Heroku for hosting.
- CircleCI for continuous integration.
- Sentry.io for error reporting.
- Postmark for e-mail delivery.
- S3 for storage of uploaded audio files.
- Cloudinary for image upload and manipulation.
- Stripe for credit card payments processing.

### Using the Stripe CLI to test webhooks locally

0. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli#install) using the directions for your OS.

1. Link the Stripe CLI to your account with

```
stripe login
```

2. To start forwarding events to your local hook,

```
stripe listen --forward-to localhost:3000/stripe_hook
```

This will provide a signing secret that you should include as `STRIPE_WEBHOOK_SECRET` in the root `.env`. Keep this terminal window open as the listener will continue to run and provide helpful output.

3. Start the local Ampled server!

4. You're now ready to listen to webhooks coming from our non-development servers and have them forwarded locally.

# Internal Tools

Located in the `tools` folder. **Please don't touch if you don't need to!**

## `application-fee-management`

A command-line tool that allows us to update our platform fee in bulk for all subscriptions across all connected accounts.

### Installation & setup

```
    cd ./tools/application-fee-management/
    yarn install
```

You'll also need a `.env` file in /tools/application-fee-management/ with `STRIPE_SECRET_KEY` set.

### Use

The command-line help provides info on the various commands and options, in addition to providing some examples.

```
yarn start --help
```
