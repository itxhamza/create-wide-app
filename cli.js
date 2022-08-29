#!/usr/bin/env node
const { program } = require("commander");
const package = require("./package.json");
const chalk = require("chalk");

const build = require("./build");

program
  .name(package.name)
  .version(package.version)
  .description(package.description);

program.argument("<folder-name>").action((name, options) => {
  try {
    build(name);
  } catch (err) {
    console.log(chalk.red(err));
  }
});

program.parse(process.argv);
