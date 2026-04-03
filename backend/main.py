from fastapi import FastAPI
app=FastAPI()

@app.get("/dashboard")
def home():
    return {"message":"Welcome to the dashboard"}




    