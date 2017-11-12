const { DialogflowApp } = require('actions-on-google')
const functions = require('firebase-functions')
const { sprintf } = require('sprintf-js')

const config = require('./env.json')
const strings = require('./strings')

const Actions = {
  TELL_FACEBOOK: 'tell.facebook',
  TELL_SLACK: 'tell.slack'
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

const getRandomValue = array => array[0]

const getInstructions = instructions => {
  if (!instructions.length) {
    return null
  }
  const step = getRandomValue(instructions)
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
  console.log('LOOK HERE => ', data)

  const instruction = getInstructions(data.facts.steps)
  app.ask(instruction)
}

const tellSlack = (app) => {
  const data = initData(app)
  const data = initData(app)
  const parameter = Parameters.SLACKPLATFORM
  const platformCategory = app.getArgument(parameter)

  const facts = data.facts.content
  for (const category of strings.facebookDoc) {
    // Initialize categories with all the facts if they haven't been read
    if (!facts[category.category]) {
      facts[category.category] = category.steps.slice()
    }
  }

  if (!data.facts.steps) {
    if (platformCategory === 'node') {
      data.facts.steps = strings.facebookDoc[0].steps.slice()
    }
    data.facts.steps = strings.facebookDoc[1].steps.slice()
  }
  console.log('LOOK HERE => ', data)

  const instruction = getInstructions(data.facts.steps)
  app.ask(instruction)
}

const actionMap = new Map()
actionMap.set(Actions.TELL_FACEBOOK, tellFacebook)
actionMap.set(Actions.TELL_SLACK, tellSlack)

const documentationDashbot
 = functions.https.onRequest((request, response) => {
   const app = new DialogflowApp({ request, response })
  //  console.log(`Request headers: ${JSON.stringify(request.headers)}`)
  //  console.log(`Request body: ${JSON.stringify(request.body)}`)
   app.handleRequest(actionMap)
 })

module.exports = {
  documentationDashbot
}
