import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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

function verifyWebhook(req: NextRequest, body: string): boolean {
  const signature = req.headers.get('x-hub-signature-256');
  if (!signature) return false;

  const buf = crypto.createHmac('sha256', APP_SECRET)
    .update(body)
    .digest('hex');
  return `sha256=${buf}` === signature;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    log.info('Success: WhatsApp webhook subscription confirmed');
    return new Response(challenge, { status: 200 });
  } else {
    log.warn('Failed: WhatsApp webhook subscription');
    return new Response('whatsapp get route webhook error', { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  
  if (!verifyWebhook(req, body)) {
    log.warn("Failed: Unverified webhook");
    return new Response('Forbidden', { status: 403 });
  }

  const webhookBody: any = JSON.parse(body);

  if (webhookBody.object === 'whatsapp_business_account') {
    for (const entry of webhookBody.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          for (const message of change.value.messages) {
            console.log('Received message:', message);
            // Handle the message here
            await handleMessage(message);
          }
        }
      }
    }
  }
  log.info('Success: Webhook processed successfully')
  return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
}

async function handleMessage(message: WhatsAppMessage): Promise<void> {
  // Implement your message handling logic here
  if (message.type === 'text' && message.text) {
    log.info(`Received text message: ${message.text.body} from ${message.from}`);
    console.log(`Received text message: ${message.text.body} from ${message.from}`);
    // Respond to the message, update database, etc.
  }
  // Handle other message types as needed
}