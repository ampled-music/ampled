# Using spraygun-react with a Rails backend

This document explains how to create a single repository that contains a Rails backend and a React frontend, where the frontend is generated with spraygun-react. The result will be:

- a single app that deploys to Heroku
- can be run in development via a single `yarn start` command

This guide currently does not cover:

- updating the Circle CI config to test both frontend and backend
- setting up browser-based end-to-end testing

Pull requests are welcome!

### 1. Generate the Rails app

Use `raygun` to generate a Rails app in a directory named e.g. `my-project`.

```
$ gem install raygun
$ raygun my-project
```

### 2. Generate the React app

Place the React app in a `client/` directory _within_ the Rails app.

```
$ cd my-project
$ npx spraygun -t react client
```

### 3. Change the default port of the React app

In development, the React app runs on port 3000 by default. This conflicts with Rails, which also runs on that port. To avoid this conflict, configure the React app to use port 5000 instead.

Create a `client/.env.development` file with these contents:

```
PORT=5000
```

Verify that the React app boots on port 5000.

```
$ cd client
$ yarn start
```

Your browser should open to `http://localhost:5000`.

### 4. Set up the development proxy

The React development server (i.e. the one running on port 5000) can automatically proxy API requests from the React frontend to the Rails backend running on port 3000. This makes for a seamless development experience with no CORS configuration necessary.

Edit `client/package.json` and add the following top-level entry:

```
"proxy": "http://localhost:3000"
```

### 5. Add a root package.json

Adding a `package.json` in the root of the Rails project, provides a couple of nice conveniences:

- install `client` dependencies when a developer (or Heroku) runs `yarn install` at the top level
- start the Rails server and React client in a single `yarn start` command

Create a `package.json` at the root of the Rails project with these contents:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "concurrently -k -r npm:start:client npm:start:server",
    "start:client": "cd client && npm-run-all start",
    "start:server": "heroku local",
    "postinstall": "cd client && yarn install"
  },
  "devDependencies": {
    "concurrently": "^3.6.1",
    "heroku": "^7.7.7",
    "npm-run-all": "^4.1.3"
  },
  "engines": {
    "node": "10.13.0",
    "yarn": ">=1.12.1"
  },
  "cacheDirectories": ["node_modules", "client/node_modules"]
}
```

Then run this at the top level:

```
$ yarn install
```

You can now start both the server and the client with one command:

```
$ yarn start
```

### 6. Add a rake task to build React

When Rails is deployed (on Heroku or any other platform), the `assets:precompile` task is invoked. To ensure that the React frontend is deployed alongside the Rails backend, hook into the precompile step to build the React app and copy it into the appropriate place where Rails can serve it.

Create a `lib/tasks/react.rake` file with these contents:

```ruby
namespace :react do
  desc "Builds the React app from client/ into the Rails public/ directory"
  task :build do
    FileUtils.cd("client") do
      system("yarn build") || raise("Failed to build React app")
      FileUtils.cp_r("build/.", "../public", verbose: true)
    end
  end
end

# `task` will enhance the assets:precompile task if it is already defined.
# So the existing sprockets behavior will continue to work.
task "assets:precompile" do
  Rake::Task["react:build"].invoke
end
```

Now when you deploy the Rails app, the React app will automatically be bundled with it and served from the same URL.

### 7. If using Heroku, add the NodeJS buildpack

If you are deploying to Heroku, you will need to notify Heroku that both the Ruby and NodeJS buildpacks are required. The React build process needs tools like `node` and `yarn` to be present. These are provided by the NodeJS buildpack.

These commands assume that you've already created your Heroku app.

```
$ heroku buildpacks:add heroku/ruby
$ heroku buildpacks:add --index 1 heroku/nodejs
```

The NodeJS buildpack must come first. Verify using the `heroku buildpacks` command:

```
$ heroku buildpacks
=== my-heroku-app-name Buildpack URLs
1. heroku/nodejs
2. heroku/ruby
```

### 8. Deploy!

You are done!

Deploy your app as usual. Don't forget to commit your changes first.

```
$ git add .
$ git commit -m "Add React frontend with spraygun-react"
$ git push heroku master
```
