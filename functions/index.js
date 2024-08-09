const { WebhookClient } = require('dialogflow-fulfillment');
const functions = require("firebase-functions");
const express = require("express");
const app = express();

app.get("/hello-world", (req, res) => {
    return res.status(200).json({ message: "Hello World!" });
});

app.post('/webhook', express.json(), function(req, res) {
    const agent = new WebhookClient({ request: req, response: res });
    console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
        const messages = [
            `Ups, no he entendido a que te refieres.`,
            `¿Podrías repetirlo, por favor?`,
            `¿Disculpa?`,
            `¿Decías?`,
            `¿Cómo?`,
            `¿No entiendo? Escribe 'Hola' para interactuar`
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        agent.add(randomMessage);
    }

    function ProbandoWebhook(agent) {
        agent.add(`Estoy enviando esta respuesta desde el webhook`);
    }

    function PortalesInteractivos(agent) {
        agent.add(`Estos son los portales interactivos de ciudad bolivar`);
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('ProbandoWebhook', ProbandoWebhook);
    intentMap.set('PortalesInteractivos', PortalesInteractivos);
    agent.handleRequest(intentMap);
})

app.use(require('./routes/portales.routes'));
exports.app = functions.https.onRequest(app);