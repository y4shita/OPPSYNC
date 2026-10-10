# 🎯 OppSync

**One Campus. Every Opportunity. Every Event.**

Students miss hackathons, internships, scholarships and club events because
announcements are scattered across websites, posters and group chats.
OppSync fixes that: paste an announcement (or upload a poster photo) and
**Gemma 4** extracts the title, deadline, eligibility and a short summary —
all on one screen.

- **Model:** `gemma-4-26b-a4b-it` via the Gemini API (`google-genai` package)
- **One screen, one Gemma call per click** — no database, no login
- **Open source** (MIT license)

## How it works

| File | What it does |
| --- | --- |
| `gemma_client.py` | The only file that talks to the API. Exposes `ask()`, `ask_with_image()` and `make_chat()`. Reads the key from the `GEMINI_API_KEY` environment variable. |
| `app.py` | The one-screen Streamlit UI. Two tabs (paste text / upload poster), one button each, results listed below. |
| `requirements.txt` | Python dependencies. |
| `.env.example` | Template for your API key (copy to `.env`). |

## How to run

1. **Install Python 3.10+**, then install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. **Get a free Gemini API key** at <https://aistudio.google.com/apikey>.

3. **Create your `.env` file** (never commit it — it's git-ignored):

   ```bash
   cp .env.example .env
   # then edit .env and paste your key
   ```

4. **Start the app:**

   ```bash
   streamlit run app.py
   ```

5. Open <http://localhost:8501>, paste an announcement or upload a poster,
   and click **Extract with Gemma 4**.

## Screenshot

![OppSync screenshot](docs/screenshot.png)

## License

MIT — see [LICENSE](LICENSE).
