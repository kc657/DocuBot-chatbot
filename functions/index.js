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
  PLATFORM: 'platform',
  FACEBOOKPLATFORM: 'facebookPlatform',
  SLACKPLATFORM: 'slackPlatform'
}

const Lifespans = {
  DEFAULT: 60,
  END: 0
}

process.env.DEBUG = 'actions-on-google:*'

const getRandomValue = array => array[0]

const getRandomFact = instructions => {
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
  if (!data.facts.steps) {
    data.facts.steps = strings.facebookDoc.slice()
  }
  console.log('LOOK HERE => ', data)

  const parameter = Parameters.FACEBOOKPLATFORM
  const platformCategory = app.getArgument(parameter)
  console.log('params is ', platformCategory)
  const fact = getRandomFact()
  app.ask(strings.facebookDoc[0].steps)
}

const tellSlack = (app) => {
  const data = initData(app)
  console.log('HELLO FROM TELLSLACK')
  const msg = 'Hello form tellslack'
  app.ask(msg)
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
