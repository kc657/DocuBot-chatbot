const { DialogflowApp } = require('actions-on-google')
const functions = require('firebase-functions')
const { sprintf } = require('sprintf-js')

const config = require('./env.json')

const Actions = {
  TELL_FACEBOOK: 'tell.facebook'
}

const Contexts = {
  FACEBOOK: 'choose_facebook-followup'
}

const Lifespans = {
  DEFAULT: 60,
  END: 0
}

process.env.DEBUG = 'actions-on-google:*'

const initData = app => {
  const data = app.data
  if (!data.facts) {
    data.facts = {
      content: {}
    }
  }
  console.log('data in initData is ', data)
  return data
}

const tellFacebook = (app) => {
  const data = initData(app)
  console.log(app)
  console.log(data)
  const msg = 'HELLO WORLD FROM TELLFACEBOOK'
  app.ask(msg)
}

const actionMap = new Map()
actionMap.set(Actions.TELL_FACEBOOK, tellFacebook)

const documentationDashbot
 = functions.https.onRequest((request, response) => {
   const app = new DialogflowApp({ request, response })
   console.log('APP IS ', app)
   console.log(`Request headers: ${JSON.stringify(request.headers)}`)
   console.log(`Request body: ${JSON.stringify(request.body)}`)
   app.handleRequest(actionMap)
 })

module.exports = {
  documentationDashbot
}
