# My Medi Buddy bilingual customer survey – Cloudflare Pages

A responsive English/Marathi 25-question survey for Seva Medical Shop, Shahada. It uses a Cloudflare Pages Function as a same-origin API proxy and Google Apps Script to submit genuine responses to the existing Google Form and its linked Google Sheets response destination.

## Package contents
- `index.html` – responsive survey, five sections, language toggle, progress indicator.
- `functions/api/submit.js` – Cloudflare Pages Function that forwards submissions to Apps Script and returns a verified success/error result to the browser.
- `Code.gs` – Google Apps Script bridge that validates all 25 answers against the existing Google Form and submits a FormResponse.
- `questions.json` – reference copy of the finalized question set.

## Existing form
The short URL supplied resolves to this published form:
`https://docs.google.com/forms/d/e/1FAIpQLScNw1agO3BJGlrWvyB2EDLyNJNBgPmX8_jsEOYrklcGpkE3-g/viewform`
The Apps Script bridge is configured for that form. It matches the exact question titles and validates each option against the live form. If you have changed the wording/options in Google Forms, align the form before deployment; the backend rejects mismatches rather than writing answers into the wrong questions.

## 1. Deploy Google Apps Script
1. Visit https://script.google.com/ and create a new project.
2. Replace the contents of `Code.gs` with this package's `Code.gs` and save.
3. Select **Deploy → New deployment → Web app**.
4. Set **Execute as: Me** and **Who has access: Anyone**.
5. Deploy and authorize the requested Google Forms permissions.
6. Copy the deployed Web app URL ending in `/exec`.

## 2. Deploy to Cloudflare Pages
1. Create a GitHub repository and upload the package contents, preserving the `functions/api/submit.js` folder path. The repository root must contain `index.html` and the `functions` folder. `Code.gs`, `README.md`, and `questions.json` may also be included.
2. In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository. Choose **None** as framework preset, leave build command blank, and set build output directory to `/` (repository root).
4. Deploy. Cloudflare provides a `*.pages.dev` URL.
5. In the Pages project, open **Settings → Variables and Secrets** and add an environment variable:
   - Name: `APPS_SCRIPT_URL`
   - Value: the Google Apps Script `/exec` URL copied in Step 1
6. Redeploy the Pages project so the function receives the variable.

## 3. End-to-end test (do this before sharing)
1. Open your deployed website and submit one clearly identified test response.
2. Confirm the website displays the thank-you message only after the backend reports success.
3. Open the existing Google Form's **Responses** tab and linked Google Sheet. Confirm the test response appears as a new row.
4. If the response is missing, inspect **Apps Script → Executions** and Cloudflare Pages Function logs. Remove the test response before collecting real customer data if you do not want it included in analysis.

## Notes
- The Apps Script endpoint is public because customers submit without signing in. It validates all 25 answers and every option against the form, but a public endpoint can still receive spam. Monitor responses during collection.
- The survey does not request names, phone numbers, email addresses, prescriptions, or health conditions.
- Do not share Apps Script editor access or Google account credentials with respondents.
- Keep the Google Form question titles and options synchronized with the website. If they change, update both `Code.gs` and the website data.


## Visual update (v3)
The website now includes a pharmacy-themed inline SVG illustration, animated hero artwork, subtle card entrance effects, hover states, animated progress bar, responsive mobile layout, reduced-motion accessibility support, and the footer credit: **Developed by Prerna Pawar**. The existing question set and `/api/submit` backend integration are retained.


## Engaging visual update (v4)
- Fixed repeated question numbering.
- English and Marathi question text now appear on separate lines.
- Added richer question cards, selected-answer feedback, emoji accents, and improved section/progress styling.
- Existing question set, submission endpoint, and developer credit are retained.
