# PaddleOCR Service

This service extracts text from scanned claim documents and images.

---

## Contents
- `Dockerfile` → OCR service image.
- `app.py` → OCR API implementation.
- `requirements.txt` → Python dependencies.

---

## Local usage

The OCR service is started automatically with Docker Compose.
If you want to run it locally:

```bash
pip install -r requirements.txt
python app.py
```

---

## Tips
- Use clear, high‑resolution scans for best results.
- Validate OCR output before reconciliation.

