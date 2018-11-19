const fs = require("fs");
const path = require("path");

exports.setup = (projectDirectory, { chalk, shell }) => {
  const appPath = path.resolve(projectDirectory);
  const appName = path.basename(projectDirectory);

  const nodeVersion = process.versions.node;
  const yarnVersion = shell
    .exec("yarn --version", { silent: true })
    .stdout.trim();

  const replacements = [
    [/app-prototype/g, appName, "Dockerfile"],
    [/app-prototype/g, appName, "README.md"],
    [/app-prototype/g, appName, "package.json"],
    [/app-prototype/g, appName, "public/manifest.json"],
    [/"node": "\d+\.\d+\.\d+"/, `"node": "${nodeVersion}"`, "package.json"],
    [/node:\d+\.\d+\.\d+/, `node:${nodeVersion}`, "Dockerfile"],
    [/nodejs \d+\.\d+\.\d+/, `nodejs ${nodeVersion}`, ".tool-versions"],
    [/node:\d+\.\d+\.\d+/, `node:${nodeVersion}`, ".circleci/config.yml"],
    [/Node \d+\.\d+\.\d+/gi, `Node ${nodeVersion}`, "README.md"],
    [/"yarn": ">=\d+\.\d+\.\d+"/, `"yarn": ">=${yarnVersion}"`, "package.json"],
    [/yarn@\d+\.\d+\.\d+/, `yarn@${yarnVersion}`, "Dockerfile"],
    [
      /YARN_VERSION=\d+\.\d+\.\d+/,
      `YARN_VERSION=${yarnVersion}`,
      ".circleci/config.yml"
    ],
    [/Yarn \d+\.\d+\.\d+/gi, `Yarn ${yarnVersion}`, "README.md"],
    [/<title>.*?<\/title>/, `<title>${appName}</title>`, "public/index.html"]
  ];

  shell.cd(projectDirectory);
  replacements.forEach(r => shell.sed("-i", ...r));
  removeBanner();
  shell.rm("-rf", "node_modules");
  shell.rm("-rf", ".git");

  const isChildOfExistingRepo = fs.existsSync("../.git");
  if (!isChildOfExistingRepo) {
    shell.exec("git init -q");
  }
  shell.exec("yarn install");
  shell.rm("-rf", ".spraygun.js");
  shell.rm("-rf", "LICENSE");
  shell.rm("-rf", "docs/how-to-use-with-rails-backend.md");
  shell.exec("git add -A .");
  shell.exec("git commit -n -q -m 'Init from spraygun template'");

  console.log(
    chalk`
  {green Success!} Created ${appName} at ${appPath}
  Your new React app contains several commands:

    {cyan yarn start}
      Starts the dev server with auto-reloading

    {cyan yarn test}
      Starts the test runner

    {cyan yarn lint}
      Runs lint checks

    {cyan yarn build}
      Bundles the app into build/ for deployment

  Your app is deployable to Heroku and can build on Circle CI out of the box.
  In addition, a sample Dockerfile is provided should you care to use it.

  We suggest that you begin by typing:

    {cyan cd} ${projectDirectory}
    {cyan yarn start}

  If you plan on integrating React with a {yellow Rails} backend, check out these docs:
  {cyan https://github.com/carbonfive/spraygun-react/blob/master/docs}

  Enjoy your Carbon Five flavored React application!
`
  );
};

function removeBanner() {
  const text = fs.readFileSync("README.md", "utf8").toString();
  const trimmed = text.replace(/[^]*<!--\s*END SPRAYGUN BANNER\s*-->\s*/i, "");
  fs.writeFileSync("README.md", trimmed, "utf8");
}
