#!/usr/bin/env node

const fs = require('fs')
const {Command, flags} = require('@oclif/command')

class CustomCommand extends Command {
  async run() {
    const {flags} = this.parse(CustomCommand)
    await require('./runLighthouse').run(
      flags.addr, 
      flags.exportTo, 
      flags.willCheckPass, 
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
    char: 'a',
    default: 'http://ratehub.ca',
  }),
  exportTo: flags.string({
    char: 'e',
    default: 'none', // or 'html'
  }),
  willCheckPass: flags.string({
    char: 'c',
    default: 'no' // or 'yes' - it's string value, not boolean
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