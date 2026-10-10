"""OppSync — One Campus. Every Opportunity. Every Event.

A one-screen Streamlit app. Paste an announcement (or upload a poster image)
and Gemma 4 extracts the title, deadline, eligibility and a short summary.
Each button click makes exactly one Gemma call. No database, no login —
results live in the browser session only.
"""

import streamlit as st

from gemma_client import ask, ask_with_image

st.set_page_config(page_title="OppSync", page_icon="🎯", layout="centered")

st.title("🎯 OppSync")
st.caption("One Campus. Every Opportunity. Every Event. — Powered by Gemma 4")

# The prompt we send to Gemma. It asks for a fixed, easy-to-read format.
EXTRACT_PROMPT = """You are helping students spot campus opportunities.
Read the announcement below and reply in exactly this format:

Title: <short title>
Type: <Hackathon | Internship | Scholarship | Competition | Club Event | Other>
Deadline: <deadline date/time, or "Not mentioned">
Eligibility: <who can apply, one line>
Summary: <2-3 sentence summary>
Why it matters: <one line on why a student should care>

Announcement:
{text}
"""

POSTER_PROMPT = """This image is a campus event/opportunity poster.
Reply in exactly this format:

Title: <short title>
Type: <Hackathon | Internship | Scholarship | Competition | Club Event | Other>
Deadline: <deadline date/time, or "Not mentioned">
Eligibility: <who can apply, one line>
Summary: <2-3 sentence summary>
Why it matters: <one line on why a student should care>
"""

# Session memory for extracted opportunities (lost on refresh — no database).
if "opportunities" not in st.session_state:
    st.session_state.opportunities = []

tab_text, tab_poster = st.tabs(["📝 Paste announcement", "🖼️ Upload poster"])

with tab_text:
    text = st.text_area(
        "Paste the announcement text",
        height=180,
        placeholder="e.g. Hacktoberfest 2026 — build with open-source AI...",
    )
    if st.button("Extract with Gemma 4", key="extract_text"):
        if not text.strip():
            st.warning("Paste some text first.")
        else:
            with st.spinner("Asking Gemma 4..."):
                result = ask(EXTRACT_PROMPT.format(text=text.strip()))
            st.session_state.opportunities.append(result)

with tab_poster:
    poster = st.file_uploader("Upload a poster image", type=["png", "jpg", "jpeg", "webp"])
    if st.button("Extract with Gemma 4", key="extract_poster"):
        if poster is None:
            st.warning("Upload an image first.")
        else:
            with st.spinner("Asking Gemma 4..."):
                result = ask_with_image(
                    POSTER_PROMPT, poster.getvalue(), mime_type=poster.type
                )
            st.session_state.opportunities.append(result)

st.divider()
st.subheader("Extracted opportunities")

if not st.session_state.opportunities:
    st.info("Nothing yet — extract an announcement above.")
else:
    for i, item in enumerate(reversed(st.session_state.opportunities), 1):
        with st.container(border=True):
            st.markdown(item)
