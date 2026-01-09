from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import tempfile
import os
from paddleocr import PPStructureV3

app = FastAPI()

class ImageRequest(BaseModel):
    image: str  # base64

@app.post("/process")
def process_image(req: ImageRequest):
    try:
        encoded_string = req.image

        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        temp_file_path = temp_file.name

        with open(temp_file_path, "wb") as f:
            f.write(base64.b64decode(encoded_string))

        pipeline = PPStructureV3(lang="en")
        output = pipeline.predict(temp_file_path)

        markdowns = []
        for res in output:
            markdown_content = res._to_markdown()['markdown_texts']
            markdowns.append(markdown_content)

        os.remove(temp_file_path)

        return {"markdown": markdowns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
