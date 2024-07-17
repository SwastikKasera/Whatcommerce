import axios from 'axios';
type Action = 
  | "showProductsToCustomer"
  | "addToCart"
  | "sendQrCodeForPayment"
  | "showMoreProductsToCustomer"
  | "noConclusionReached"


interface ChatResponse {
  keywords: string[],
  filter:{
    price:{
        min:number,
        max:number
    }
  },
  category: string[],
  attributes: {
    size:string,
    color:string
  },
  action: Action
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
      chatbot_global_action: `Understand the user intent, just like they want to shop on ecommerce store.
      Note: it has a field name action which have functionName, I call that function to take the next decision so choose the appropriate one and you are strictly allowed to return only JSON of a the below structure 
      "{
            keywords: string[],
            filter:{
                price:{
                    min:number,
                    max:number
                }
            },
            category: string[],
            attributes: {
                size:string,
                color:string
            },
            action: "showProductsToCustomer" or "addToCart" or "sendQrCodeForPayment" or "showMoreProductsToCustomer" or "noConclusionReached";
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