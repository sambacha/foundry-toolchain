#!/usr/bin/env node
/**
 * @package Foundry Anvil
 * @version v0.0.1
 * @author Foundry Contributors 
 * 
 */
const io = require('@actions/io');
const core = require('@actions/core');
const { exec } = require('@actions/exec');

const OutputListener = require('./OutputListener');
// FIXME: PATH?
const pathToCLI = require('./lib/anvil-bin');

async function checkAnvil () {
  // @note Setting check to `true` will cause `which` to throw if anvil isn't found or available
  const check = true;
  return io.which(pathToCLI, check);
}

(async () => {
  // @note This will fail if Anvil isn't found, which is what we want
  await checkAnvil();

  // @dev Create listeners to receive output (in memory) as well
  const stdout = new OutputListener();
  const stderr = new OutputListener();
  const listeners = {
    stdout: stdout.listener,
    stderr: stderr.listener
  };

  // @dev Execute anvil and capture output
  const args = process.argv.slice(2);
  const options = {
    listeners,
    ignoreReturnCode: true
  };
  const exitCode = await exec(pathToCLI, args, options);
  core.debug(`Anvil exited with code ${exitCode}.`);
  core.debug(`stdout: ${stdout.contents}`);
  core.debug(`stderr: ${stderr.contents}`);
  core.debug(`exitcode: ${exitCode}`);

  // @dev Set outputs, result, exitcode, and stderr
  // @note should sigint for exiting?
  core.setOutput('stdout', stdout.contents);
  core.setOutput('stderr', stderr.contents);
  core.setOutput('exitcode', exitCode.toString(10));

  // A non-zero exitCode is considered an error
  if (exitCode !== 0) {
    core.setFailed(`Anvil exited with code ${exitCode}.`);
  }
})();
