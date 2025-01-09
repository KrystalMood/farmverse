import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

model = genai.GenerativeModel('gemini-pro')

def chat_with_gemini():
    chat = model.start_chat(history=[])
    
    print("Welcome to Gemini Chat! (Type 'quit' to exit)")
    print("-" * 50)
    
    while True:
        user_input = input("\nYou: ")
        
        if user_input.lower() == 'quit':
            print("\nGoodbye!")
            break
        
        try:
            response = chat.send_message(user_input)
            
            print("\nGemini:", response.text)
            
        except Exception as e:
            print(f"\nError: {str(e)}")

if __name__ == "__main__":
    chat_with_gemini() 