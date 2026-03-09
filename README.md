# CareerLens - AI-Powered Resume Analysis Platform

A modern web application built with React, TypeScript, Vite, and Tailwind CSS that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS).

## Features

- **Authentication**: Login and register with localStorage-based auth
- **Resume Upload**: PDF parsing using pdfjs-dist
- **Role Selection**: 99+ job roles across 6 categories
- **ATS Analysis**: 
  - Skill matching with variations
  - Section detection
  - Action verb detection
  - Quantified achievement detection
  - Weighted scoring algorithm
- **Results Dashboard**: 
  - Visual score gauge
  - Matched/missing skills by level
  - Section analysis
  - Improvement suggestions
  - Learning resources

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- pdfjs-dist
- Lucide React (icons)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth)
├── data/          # Role database & learning resources
├── pages/         # Page components
├── services/      # ATS engine
├── types/         # TypeScript types
└── lib/           # Utilities
```

## Usage

1. Register or login
2. Upload your PDF resume
3. Select target job role
4. Click "Analyze Resume"
5. View detailed results and recommendations
