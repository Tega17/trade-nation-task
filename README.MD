## Trade Nation Playwright Automation Framework

This repository contains an end-to-end test automation framework built using Playwright
 and TypeScript.
It automates positive and negative test scenarios for the Trade Nation platform and integrates GitHub Actions for continuous integration (CI).

## Project Overview

This project automates the following scenarios for Trade Nation
:

Test 1 – Positive Test (TradeNationHomePage.spec.ts)

Navigate to: https://tradenation.com/en-gb/markets/#forex

Click on the Trade Nation logo on the top of the page.

Validate and display the current page title.

Test 2 – Negative Test (GoogleInvalidLogin.spec.ts)

Click on Sign up / Log in at the top of the homepage.

Click Log in here.

Select Log in with Google on the login page
.

Attempt login using invalid credentials.

Validate and display the error message.

## Tech Stack

Language: TypeScript

Framework: Playwright

Design Pattern: Page Object Model (POM)

CI/CD: GitHub Actions

Viewports Tested: Desktop — 1280x800

## Project Structure
trade-nation-playwright/
├── tests/
│   ├── TradeNationHomePage.spec.ts     # Positive test cases
│   ├── GoogleInvalidLogin.spec.ts      # Negative test cases
├── pages/
│   ├── HomePage.ts                     # Page object for homepage
│   ├── AuthPage.ts
    ├── GoogleAuthPage.ts                     # Page object for login page
├── .github/
│   └── workflows/
│       └── playwright.yml              # GitHub Actions workflow file
├── playwright.config.ts               # Playwright configuration
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # Documentation

## Installation
1. Clone the Repository
git clone https://github.com/Tega17/trade-nation-task.git
cd trade-nation-task

2. Install Dependencies

Make sure you have Node.js ≥ 16 installed, then run:

npm install

3. Install Playwright Browsers
npx playwright install

## Running the Tests
Run All Tests
npx playwright test

Run Tests in UI Mode
npx playwright test --ui

Run a Specific Test File
npx playwright test tests/TradeNationHomePage.spec.ts

Generate and View HTML Report
npx playwright show-report

## Configuration

The test viewport is configured for desktop mode (1280x800) in playwright.config.ts:

use: {
  viewport: { width: 1280, height: 800 },
  headless: true,
}

## Continuous Integration (GitHub Actions)

This project comes with a GitHub Actions workflow to automatically run Playwright tests on every push and pull request.

Workflow File

Located at: .github/workflows/playwright.yml
