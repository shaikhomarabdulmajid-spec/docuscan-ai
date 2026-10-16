import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

def analyze_document_text(text_content: str, analysis_type: str) -> str:
    # Initialize the open-weight Llama 3 model via your free Groq API key
    llm = ChatGroq(
        temperature=0.2, 
        model_name="llama3-70b-8192",
        groq_api_key=os.environ.get("GROQ_API_KEY")
    )
    
    # Structural prompt instructions optimized for lightweight models
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert document analysis AI engine. "
                   "Your job is to perform a highly accurate extraction based on the user's requested type. "
                   "Format your response cleanly in Markdown."),
        ("human", "Please perform a strict '{type}' on the following document context:\n\n{document_text}")
    ])
    
    # Format and pass inputs directly to the LLM layer
    chain = prompt | llm
    result = chain.invoke({"type": analysis_type, "document_text": text_content})
    return result.content
