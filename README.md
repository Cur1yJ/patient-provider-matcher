# Provider Matching Challenge

This app is the solution to Anise Health's take-home coding challenge, an app that connects patients with health providers.

To work within the challenge's tight time constraints this uses an extremely simple substring based matching for ranking and filtering. For production use, I encourage exploration of vector based databases and/or search platforms like Elastic Search.

## ⚡ Quick Start

### 1. Copy your providers CSV into the data folder

Save the challenge's mock data as `providers.csv` in the data folder, i.e. `[path to this folder]/data/providers.csv`.

### 2. Install Python dependencies

```
python -mvenv .venv
source .venv/bin/activate
pip install -r requirements.txt
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

Run `make frontend.run` to start the frontend. Assuming you don't have any other services running on port 3000, it'll start listening at `http://127.0.0.1:3000`.
