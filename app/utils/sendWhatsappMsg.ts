import axios, { Axios } from "axios";

export async function WhatsappSendText (message: string, whatsappBId: string, phoneNumber:string) {
    const resp: Axios = await axios.post(`https://graph.facebook.com/v20.0/${whatsappBId}/messages`, {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phoneNumber,
        "type": "text",
        "text": {
            "body": message
        }
    },{
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_PERMANENT_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })

}
export async function WhatsappSendInteractiveList (header: string, body:string, footer:string, whatsappBId: string, phoneNumber:string) {
    const resp: Axios = await axios.post(`https://graph.facebook.com/v20.0/${whatsappBId}/messages`, {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phoneNumber,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": header,
            "body": {
                "text":body
            },
            "footer": {
                "text": footer
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "",
                            "title": ""
                        }
                    }
                ]
            }
        }
    },{
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_PERMANENT_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })

}

export async function WhatsappSendPaymentRequest() {
    
}