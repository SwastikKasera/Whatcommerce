import { ShowProductsToCustomer } from '@/app/actions/ShowProductsToCustomer';
import { getChatResponse } from '@/app/utils/chatApi';
import { NextRequest, NextResponse } from 'next/server';
// import crypto from 'crypto';
const { log } = require('@logtail/next');

// Replace with your actual app secret
const APP_SECRET = process.env.WHATSAPP_APP_SECRET || '';
// Replace with your actual verify token
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || '';

interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: {
    body: string;
  };
}

// function verifyWebhook(req: NextRequest, body: string): boolean {
//   const signature = req.headers.get('x-hub-signature-256');
//   if (!signature) {
//     log.warn('Signature missing from headers');
//     return false;
//   }

//   const buf = crypto.createHmac('sha256', APP_SECRET)
//     .update(body)
//     .digest('hex');
//   const isValid = `sha256=${buf}` === signature;

//   log.info('Webhook verification result', { isValid, signature });

//   return isValid;
// }

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  log.info('GET request received', { mode, token, challenge });
  

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    log.info('Success: whatsapp get webhook', { mode, token });
    return new Response(challenge, { status: 200 });
  } else {
    log.warn('Failed: whatsapp get webhook', { mode, token });
    return new Response('whatsapp get route webhook error', { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  log.info('POST request body received', { body });

  //we will integrate verify webhook code later

  let webhookBody: any;
  try {
    webhookBody = JSON.parse(body);
    log.info('Webhook body parsed successfully', { webhookBody });
  } catch (error) {
    log.error('Failed to parse webhook body', { error });
    return new Response('Invalid JSON', { status: 400 });
  }

  if (webhookBody.object === 'whatsapp_business_account') {
    log.info('Processing WhatsApp business account messages', { webhookBody });
    for (const entry of webhookBody.entry) {
      //use entry.id to fetch details about the business and store it on redis
      log.info('Processing entry', { entry });
      for (const change of entry.changes) {
        log.info('Processing change', { change });
        if (change.field === 'messages') {
          for (const message of change.value.messages) {
            log.info('Received message', { message });
            // Handle the message here
            if(message.type === 'text') {
              await handleMessage(message);
            }
          }
        }
      }
    }
  }
  log.info('Success: Webhook processed successfully');
  return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
}

async function handleMessage(message: WhatsAppMessage): Promise<void> {
  // Implement your message handling logic here
  log.info('Handling message', { message });
  if (message.type === 'text' && message.text) {
    log.info(`Received text message: ${message.text.body} from ${message.from}`);
    console.log(`Received text message: ${message.text.body} from ${message.from}`);
    const aiResponse = await getChatResponse(message.text.body);
    const jsonResponse: any = await JSON.parse(aiResponse?.openai?.generated_text)
    console.log("airesponse",jsonResponse);
    
    const keywords = jsonResponse?.keywords
    const filter = jsonResponse?.filter
    const action = jsonResponse?.action
    console.log("action",action)
    switch (action) {
      case "showProductsToCustomer":
        await ShowProductsToCustomer(keywords, filter)
        break;
      case "addToCart":
        // addToCart
        break;
      case "sendQrCodeForPayment":
        // sendQrCodeForPayment
        break;
      case "noConclusionReached":
        // noConclusionReached
        break;
      case "removeFromCart":
        // removeFromCart
        break;
    
      default:
        break;
    }
    
  }
  // Handle other message types as needed
}
