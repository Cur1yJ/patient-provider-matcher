.PHONY: backend.run frontend.run

backend.run: 
	cd backend && uvicorn app.main:app --reload

frontend.run:
	cd frontend && npm run dev
