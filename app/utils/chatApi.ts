import axios from 'axios';
type Action = 
  | "showProductsToCustomer"
  | "addToCart"
  | "sendQrCodeForPayment"
  | "noConclusionReached"
  | "removeFromCart"


interface ChatResponse {
  openai: any;
  action: Action,
  takeAction: false,
  keywords: [],
  filter: {
      price: {
          min: 0,
          max: 0
      },
      category: [],
      attributes: {
          size: string,
          color: string
      }
  },
  products: [
      {
          productId: string,
          qty: 0
      }
  ],
  payment: {
      sendQrCode: false
  }
}

interface ChatMessage {
  role: string;
  message: string;
}

export async function getChatResponse(prompt: string, previousHistory: ChatMessage[] = []): Promise<ChatResponse> {
  const options = {
    method: 'POST',
    url: 'https://api.edenai.run/v2/text/chat',
    headers: {
      authorization: `Bearer ${process.env.EDENAI_API_KEY}`,
    },
    data: {
      providers: 'openai',
      text: `Customer message:${prompt}`,
      chatbot_global_action: `We are relying on you to understand the user intent and action they want to shop for products.
      Note: it has a field name action which have functionName, I call that function to take the next decision so choose the appropriate one and you are strictly allowed to return only JSON of the below structure. If you are filling action with some value, make sure that 'takeAction' must be true.
      "{
        "action": "showProductsToCustomer" or "addToCart" or "sendQrCodeForPayment" or "noConclusionReached" or "removeFromCart",
        "takeAction": false,
        "keywords": [],
        "filter": {
            "price": {
                "min": 0,
                "max": 0
            },
            "category": [],
            "attributes": {
                "size": "",
                "color": ""
            }
        },
        "products": [
            {
                "productId": "",
                "qty": 0
            }
        ],
        "payment": {
            "sendQrCode": false
        }
      }"`,
      previous_history: previousHistory,
      temperature: 0.0,
      max_tokens: 150,
    },
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error('Error in getChatResponse:', error);
    throw error;
  }
}