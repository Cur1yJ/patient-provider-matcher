# Provider Matching Challenge

This app is the solution to Anise Health's take-home coding challenge, an app that connects patients with health providers.

To work within the challenge's tight time constraints this uses an extremely simple substring based matching for ranking and filtering. For production use, I encourage exploration of vector based databases and/or search platforms like Elastic Search.

------------

## Story:
We’d like you to tackle a simplified problem inspired by our work: building a web app for matching patients with therapists, considering performance, data privacy, and adaptability to changing user needs.

## The Challenge:
Patients are matched to therapists who best meet their needs in order to maximize the chance of treatment success. Build a web app that matches new patients to available therapists based on a number of criteria which will influence their fit. This is intentionally scoped to be completed in 3-5 hours - use any tools you prefer. 

## Objective: 
Design and implement a web app that:
1. Accepts a patient’s request with their needs/preferences.
2. Matches the patient to a suitable provider based on predefined criteria.
3. Returns up to 3 best matches with relevant details.

## Requirements:
1. Input: Implement an API endpoint where a patient can submit:
   - Areas of Concern: (e.g., anxiety, depression, racial identity related issues, academic stress, Trauma-related stress, Work-related stress, insomnia).
   - Preferred Treatment Modality: (e.g., cognitive behavioral therapy, dialectical behavior therapy, acceptance and commitment therapy, EMDR) 
   - Demographics: (e.g. Japanese, Christian, married)
   - Therapist Preferences: (e.g., female, East Asian, Muslim).
   - Location: (e.g., California, New York).
   - Payment Method: (e.g. Aetna, Magellan, Anthem, Self-pay)

2. Logic: Use predefined mock data for providers with the following fields:
   - Name, specialty, treatment modality, location, ethnic/gender identity, sexual orientation, language(s), short bio, capacity [provide mock data in CSV]
   - Here is some [mock data](https://github.com/Cur1yJ/patient-provider-matcher/blob/main/Take%20Home%20Exercise%20Providers%20Data.csv) with sample providers. Feel free to modify and/or expand upon it as you see fit.

3. Output:
   - Return up to 3 best matches for the patient, including provider’s full profile
   - Do not worry about the UI of the output

4. Technical Notes:
   - Use any programming language or framework you prefer.
      - Slight preference for Anise’s tech stack:
         - Frontend: Angular [Javascript]
         - Backend: Springboot [Java], Prefect [Python]
  - Use any AI tools, frameworks, or libraries you need.
   - Use mock data for providers. No need for a persistent database.
   - Focus on functionality and code quality rather than complex algorithms.

## Submission Guidelines
1. Share your code repository 
2. Include a README file with set up instructions and your approach 
3. Be prepared to discuss improvements in the next round or scaling the system.
4. Submit your project within 7 days of receiving this prompt.

## What We're Looking For
- A functional prototype that meets the core requirements.
- Clean, maintainable, and well-structured code.
- Logical, easy-to-follow matching implementation.
- Product thinking around your matching criteria and design decisions.

------------

## ⚡ Quick Start

### 1. Copy your providers CSV into the data folder

Save the challenge's mock data as `providers.csv` in the data folder, i.e. `[path to this folder]/data/providers.csv`.

### 2. Install Python dependencies

```
python -mvenv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 3. Start the backend and try a sample request

Run `make backend.run`.

The backend will boot up and start listening at `http://127.0.0.1:8000`. The specific endpoint is `http://127.0.0.1:8000/providers/search` which follows the signature in the sample code below.

```python
import requests

requests.post(
    "http://127.0.0.1:8000/providers/search",
    json={
        "areas_of_concern": ["low self-esteem"],
        "preferred_treatment_modality": ["cbt"],
        "languages": ["english"],
        "payment_methods": ["credit card"],
        "therapist_preferences": ["female"],
        "locations": ["ca"]
    },
    timeout=20
)
```


### 4. Start the frontend

Install dependencies with `cd frontend && npm i && cd ..` then run `make frontend.run` to start the frontend. Assuming you don't have any other services running on port 3000, it'll start listening at `http://127.0.0.1:3000`.
