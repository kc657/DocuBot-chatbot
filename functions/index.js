const { DialogflowApp } = require('actions-on-google')
const functions = require('firebase-functions')
const { sprintf } = require('sprintf-js')

const config = require('./env.json')
const dashbot = require('dashbot')(config.DASHBOT_API_KEY).google

const strings = require('./strings')

const Actions = {
  TELL_FACEBOOK: 'tell.facebook',
  TELL_SLACK: 'tell.slack',
  INPUT_UNKNOWN: 'input.unknown',
  REPORT_BUG: 'report.bug'
}

const Contexts = {
  FACEBOOK: 'choose_facebook-followup',
  SLACK: 'choose_slack-followup'
}

const Parameters = {
  FACEBOOKPLATFORM: 'facebookPlatform',
  SLACKPLATFORM: 'slackPlatform'
}

const Lifespans = {
  DEFAULT: 60,
  END: 0
}

process.env.DEBUG = 'actions-on-google:*'

const getInstructions = instructions => {
  if (!instructions.length) {
    return null
  }
  const step = instructions[0]
  // Delete the fact from the local data since we now already used it
  instructions.splice(instructions.indexOf(step), 1)
  return step
}

const initData = app => {
  const data = app.data
  if (!data.facts) {
    data.facts = {
      content: {},
      steps: null
    }
  }
  return data
}

const tellFacebook = (app) => {
  const data = initData(app)
  const parameter = Parameters.FACEBOOKPLATFORM
  const platformCategory = app.getArgument(parameter)
  console.log('params is ', platformCategory)

  const facts = data.facts.content
  for (const category of strings.facebookDoc) {
    // Initialize categories with all the facts if they haven't been read
    if (!facts[category.category]) {
      facts[category.category] = category.steps.slice()
    }
  }

  if (!data.facts.steps) {
    if (platformCategory === 'npm') {
      data.facts.steps = strings.facebookDoc[0].steps.slice()
    }
    data.facts.steps = strings.facebookDoc[1].steps.slice()
  }

  const instruction = getInstructions(data.facts.steps)

  app.ask(instruction)
}

const tellSlack = (app) => {
  const data = initData(app)
  const parameter = Parameters.SLACKPLATFORM
  const platformCategory = app.getArgument(parameter)

  const facts = data.facts.content
  for (const category of strings.slackDoc) {
    // Initialize categories with all the facts if they haven't been read
    if (!facts[category.category]) {
      facts[category.category] = category.steps.slice()
    }
  }

  if (!data.facts.steps) {
    if (platformCategory === 'node') {
      data.facts.steps = strings.slackDoc[0].steps.slice()
    }
    data.facts.steps = strings.slackDoc[1].steps.slice()
  }

  const instruction = getInstructions(data.facts.steps)
  app.ask(instruction)
}

const inputUnknown = (app) => {
  const data = initData(app)
  const msg = "Sorry, I didn't quite get that. I'll make a mental note on what you said and try to improve on my documentation. If you encountered a bug, just let me know and I'll also inform the developers."
  app.ask(msg)
}

const reportBug = (app) => {
  const data = initData(app)
  const msg = "I see...anything else about this problem you can tell me about so we can fix it asap and get back to you."
  app.ask(msg)
}

const actionMap = new Map()
actionMap.set(Actions.TELL_FACEBOOK, tellFacebook)
actionMap.set(Actions.TELL_SLACK, tellSlack)
actionMap.set(Actions.INPUT_UNKNOWN, inputUnknown)
actionMap.set(Actions.REPORT_BUG, reportBug)

const documentationDashbot
 = functions.https.onRequest((request, response) => {
   const app = new DialogflowApp({ request, response })
   dashbot.configHandler(app)
   app.handleRequest(actionMap)
 })

module.exports = {
  documentationDashbot
}
