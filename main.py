import os
from fastapi import FastAPI, Request, UploadFile, File, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from agent import analyze_document_text

app = FastAPI(title="Hacktoberfest DocuScan AI")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def serve_dashboard(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/analyze")
async def execute_analysis(
    file: UploadFile = File(...), 
    analysis_type: str = Form(...)
):
    try:
        # Read the uploaded raw document file text bytes content cleanly
        contents = await file.read()
        text_content = contents.decode("utf-8")
        
        if not text_content.strip():
            return JSONResponse(status_code=400, content={"error": "The uploaded document appears to be empty."})
        
        # Route text straight to the LangChain Groq processor module
        ai_output = analyze_document_text(text_content, analysis_type)
        return JSONResponse(status_code=200, content={"result": ai_output})
        
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    # Bind server to 0.0.0.0 and listen for Render container environmental variables
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
