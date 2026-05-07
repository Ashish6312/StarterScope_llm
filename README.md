# StartupScope Backend API

This is the AI-powered business intelligence backend for StartupScope.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   - Copy `.env.example` to `.env`
   - Fill in your API keys (Gemini, Groq, Serper, etc.)
   - Set up a PostgreSQL database and provide `DATABASE_URL`

3. **Run the Server**:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`.

## Frontend Integration
Point your frontend's `NEXT_PUBLIC_API_URL` or equivalent environment variable to this backend's URL.

## Endpoints
- `POST /api/recommendations`: Get market analysis and business ideas
- `POST /api/businesses/enrich`: Get deep financial metrics for a specific business
- `POST /api/location/parse`: Parse and sanitize location strings

# StarterScope_llm
