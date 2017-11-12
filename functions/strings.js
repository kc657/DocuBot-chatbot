const deepFreeze = require('deep-freeze');

const facebookDoc = [
  {
    "category": "npm",
    "suggestion": "NPM",
    "steps": [
      "Each bot needs its own API key for tracking. Click the link below to create an unique API key for your project.",
      "I need you to install NPM next. Navigate to the project directory in your temrinal and type 'npm install --save dashbot'.",
      "After NPM completes installing, include Dashbot in your main JS file so I can get access. Add this following line to the top of your file: 'const dashbot = require('dashbot')(DASHBOT_API_KEY_FROM_STEP_ONE).facebook'.",
      "Next, you want to log whenever your webhook is called by adding this line to your app.post function: 'dashbot.logIncoming(request.body)'.",
      "Almost done! Last step is to log the request and response when a message is sent. Add 'dashbot.logOutgoing(requestData, response.body)' to your final request function."
    ],
    "stepsPrefix": "Okay, here's the next step for NPM integration."
  },
  {
    "category": "rest",
    "suggestion": "REST",
    "steps": [
      "Each bot needs its own API key for tracking. Click the link below to create an unique API key for your project.",
      "When Facebook posts to your webhook endpoint, post the same data Facebook sent to you to the following endpoint: 'https://tracker.dashbot.io/track?platform=facebook&v=9.4.0-rest&type=incoming&apiKey=API_KEY_HERE'",
      " Make sure to set the 'Content-Type' header to 'application/json'.",
      "And when your bot sends a message, POST to the following endpoint: 'https://tracker.dashbot.io/track?platform=facebook&v=9.4.0-rest&type=outgoing&apiKey=API_KEY_HERE'.",
      "Make sure to set the 'Content-Type' header to 'application/json' just like the earlier post."
    ],
    "stepsPrefix": "Okay, here's the next step for REST integration."
  }
]

const slackDoc = {
  
}

const content = {
  "link": "https://www.dashbot.io/bots"
}

const transitions = {

}

const general = {

}

module.exports = deepFreeze({
  facebookDoc,
  slackDoc,
  content,
  transitions,
  general
});
