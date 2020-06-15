#!/usr/bin/env node

const fs = require('fs')
const {Command, flags} = require('@oclif/command')

class CustomCommand extends Command {
  async run() {
    const {flags} = this.parse(CustomCommand)
    await require('./runLighthouse').runTestWithFileList(
      flags.addr, 
      flags.listOfFiles,
      flags.exportTo,
      flags.minPerformance, 
      flags.minAccessibility, 
      flags.minBestPractices,
      flags.minSEO,
      flags.minPWA);
  }
}

CustomCommand.flags = {
  version: flags.version(),
  help: flags.help(),
  addr: flags.string({
    default: 'https://ratehub.ca',
  }),
  listOfFiles: flags.string({
    default: 'null' // or path to the file
  }),
  exportTo: flags.string({
    default: 'html', // or 'json' or 'both'
  }),
  minPerformance: flags.string({
    default: 0.5
  }),
  minAccessibility: flags.string({
    default: 0.5
  }),
  minBestPractices: flags.string({
    default: 0.5
  }),
  minSEO: flags.string({
    default: 0.5
  }),
  minPWA: flags.string({
    default: 0.5
  })
}

CustomCommand.run()
.catch(require('@oclif/errors/handle'))
