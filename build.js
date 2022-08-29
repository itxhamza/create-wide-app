const path = require("path");
const fs = require("fs");
const figlet = require("figlet");
const chalk = require("chalk");
const execSync = require("child_process").execSync;
const spawn = require("cross-spawn");
const gitPullOrClone = require("git-pull-or-clone");

function shouldUseYarn() {
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

const installPackages = () => {
  console.log(chalk.green.bold("Installing Packages"));
  return new Promise((resolve, reject) => {
    let command;
    let args = ["install"];

    if (shouldUseYarn()) {
      command = "yarn";
    } else {
      command = "npm";
    }

    const child = spawn(command, args, { stdio: "inherit" });
    child.on("close", (code) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(" ")}`,
        });
        return;
      }
      resolve();
    });
  });
};

/**
 * Clone or pull the template from the repository.
 * @param {string} url - the url of the repository.
 * @param {function} callback - the callback function.
 * @returns None
 */
const build = (appName) => {
  if (fs.existsSync(`./${appName}`)) {
    console.log(chalk.bold.red("Folder Already Exists"));
    return;
  }
  console.log(chalk.green.bold("Downloading Template..."));
  gitPullOrClone(
    "https://github.com/itxhamza/wide-js-template.git",
    `./${appName}`,
    (err) => {
      if (err) throw err;
      console.log(chalk.white.bold("Downloading Completed!"));
      console.log("----------------------------------------------------------");
      figlet.text("Wide . JS", function (err, data) {
        if (err) {
          return;
        }
        console.log(data);
        console.log(
          "----------------------------------------------------------"
        );
        console.log(chalk.white.bold("Welcome to FWK-NODE"));
        console.log(
          "----------------------------------------------------------"
        );
        // console.log(cd);
        process.chdir("./" + appName);
        // console.log("Happy Coding");
        installPackages()
          .then(() => {
            let packageFilePath = path.join(process.cwd(), `./package.json`);
            let package = require(packageFilePath);
            package.name = appName.toLowerCase();
            fs.writeFileSync(packageFilePath, JSON.stringify(package, null, 2));
            console.log(chalk.white.bold("Let's get started"));
            console.log(
              "----------------------------------------------------------"
            );
            console.log(
              chalk.green(
                "Step 1: cd into the newly created " +
                  chalk.bold(appName) +
                  " directory "
              )
            );
            console.log(chalk.black.bold("cd " + appName));
            console.log(
              "----------------------------------------------------------"
            );
            console.log(
              chalk.green("Step 2: Run Starter kit in development mode. ")
            );
            console.log(chalk.black.bold("npm run dev"));
            // add your own custom messages here.
            console.log(
              "----------------------------------------------------------"
            );
          })
          .catch((error) => {
            console.log(chalk.red("An unexpected error occurred"));
            console.log(chalk.red(error));
          });
      });
    }
  );
};

module.exports = build;
