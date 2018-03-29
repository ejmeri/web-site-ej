let request = require('request');
const getLines = require('../metro/lines');


function trataMessage(event) {
    var senderId = event.sender.id;
    var recipientId = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    var messageId = message.mid;
    var messageText = message.text;
    var files = message.attachments;


    if (messageText) {

        switch (messageText) {
            case 'oi':
                sendTextMessage(senderId, messageText);
                break;
            case 'status':
                sendFirstMenu(senderId);
                break;
            default:
                sendTextMessage(senderId, 'Entendi porra nenhuma.');
                break;
        }
    } else if (files) {
        sendTextMessage(senderId, "Send more attachments.");
    }
}

function sendFirstMenu(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Qual linha você procura?",
                    buttons: [
                        // {
                        //   type:"web_url",
                        //   url: "https://www.messenger.com",
                        //   title:"Visit Messenger"
                        // },
                        {
                            type: 'postback',
                            title: 'Amarela',
                            payload: '-Amarela'
                        },
                        {
                            type: 'postback',
                            title: 'Azul',
                            payload: '-Azul'
                        },
                        {
                            type: 'postback',
                            title: 'Verde',
                            payload: '-Verde'
                        },
                        {
                            type: 'postback',
                            title: 'Lilás',
                            payload: '-Lilás'
                        },
                    ]
                }
            }
        }
    };

    this.callSendApi(messageData);
}

function callSendApi(messageData) {
    request({
        url: 'https://graph.facebook.com/v2.12/me/messages',
        qs: {
            access_token: 'EAAC8xciVqogBAAKMrNIpB1gU1ewlACNc6dNtZAF1uc4G990OdDXMB9zn48sGLlkWIJZAezx9WVPsTHVRccRlGtnZCKBPXuKhrboK493EFySyZBmHvvjPQIrMOs3wDQgqeq7ELESIZCJVZAyTuZBNWpZCUhAZCXR4EVWAEQhRsyzo1Ra7whQDud7HN'
        },
        method: 'POST',
        json: messageData,
    }, function (err, res, body) {

        if (err) {
            console.log(err);
        } else if (res.statusCode == 200) {
            console.log(`Message sended. to ${body.recipient_id}`);
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
        }
    });

}

exports.sendMenuCptm = (recipientId) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "CPTM",
                    buttons: [{
                        type: "web_url",
                        url: "http://www.cptm.sp.gov.br/Pages/Home.aspx",
                        title: "Acesse o site da CPTM."
                    }]
                }
            }
        }
    };

    callSendApi(messageData);
}

exports.sendTextMessage = async (recipientId, messageText) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    callSendApi(messageData);
}

exports.sendStatusLine = async (payload) => {
    var text = 'erro';
    var retorno = await getLines();

    var line = '';

    retorno.StatusMetro.ListLineStatus.forEach(function (v, i) {
        line = v.Color;

        if (payload == line) {
            text = `Status da linha ${v.Line}: ${v.StatusMetro}`;

            if (v.Status == 0) text += ' :) ';
            else text += ' :( ';

            if (v.Description) {
                text += `\n\n${v.Description}`;
            }


            text += `\nHorário: ${retorno.StatusMetro.DateUpdateMetro}`;

        }
    });

    return text;

}

exports.sendStatusLineYellow = async () => {
    var text = 'erro';
    
    getLines().then(function (value) {
        text = `Status: ${value.CurrentLineStatus.Status} :)\n\n`;

        if (value.CurrentLineStatus.Description) {
            text += `Descrição: ${value.CurrentLineStatus.Description}\n\n`;
        }

        text += `Horário: ${value.CurrentLineStatus.DateUpdateFormated}`;
    }).catch(err => {
       text = err;
    });

    console.log(text, ' function');
    return text;
}