import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { setTimeout } from 'node:timers/promises';
const sroutes = [
  { path: '' },
  { path: 'page1' },
  { path: 'surveyconsent' },
  { path: 'prelimform' },
  { path: 'greetings' },
  { path: 'residence1' },
  { path: 'transportation1' },
  { path: 'transportation2' },
  { path: 'mainpurpose' },
  { path: 'visitfrequencyform' },
  { path: 'travelquestion' },
  { path: 'travelwith' },
  { path: 'traveloptions' },
  { path: 'packagetouritems' },
  { path: 'packagepaid' },
  { path: 'packagetourfeedback' },
  { path: 'expensetracker' },
  { path: 'percentagesharelist' },
  { path: 'expensecompanions' },
  { path: 'branchingselect' },
  { path: 'howmanynights' },
  { path: 'accommodationform' },
  { path: 'wherestayed' },
  { path: 'bookingform' },
  { path: 'accomodationopen2' },
  { path: 'primaryatt' },
  { path: 'visitcounteratt' },
  { path: 'rateattraction' },
  { path: 'attractionform' },
  { path: 'willrecom' },
  { path: 'wherelearn' },
  { path: 'eventsopen1' },
  { path: 'packtranspo' },
  { path: 'transportation3' },
  { path: 'opentranspo' },
  { path: 'services2' },
  { path: 'openendedservice' },
  { path: 'destshlist' },
  { path: 'openendedlifestyle' },
  { path: 'rategeneralpricing' },
  { path: 'pprofile1' },
  { path: 'pprofile2' },
  { path: 'surveyvenue' },
  { path: 'surveyevaluation05' },
  { path: 'survey-complete' },
  { path: 'estopenfeedback' },
  { path: 'feedback-complete' }
];

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Set the viewport size (width, height)
  await page.setViewport({ width: 768, height: 1024 });

  // Define the URLs of your React app pages
  const BASE_URL = 'http://localhost:3000';

  const pagesToScreenshot = [
    `${BASE_URL}/survey`,
    ...sroutes.map(route => `${BASE_URL}/survey/${route.path}`).filter(url => !url.endsWith('/'))
  ];
  
  console.log(pagesToScreenshot);
  
  // Define the language you want to set in localStorage
  const selectedLanguage = 'ja'; // Example: Japanese

  // Define the base directory for saving screenshots
  const baseDir = 'C:\\Users\\Paul Andre\\Pictures\\localization';

  // Create a subfolder with the current timestamp (e.g., ja_20231025_1530)
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const subfolder = `${selectedLanguage}_${timestamp}`;
  const saveDir = path.join(baseDir, subfolder);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
  }

  // Pre-inject localStorage setting before any navigations
  await page.evaluateOnNewDocument((language) => {
    localStorage.setItem('selectedLanguage', language);
  }, selectedLanguage);

  // Loop through each URL and take a screenshot
  for (let i = 0; i < pagesToScreenshot.length; i++) {
    const url = pagesToScreenshot[i];
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Give the page time to fully animate and render
    await setTimeout(800 ); // Adjust the time as needed
    // Take a screenshot, named by its number in sequence
    const fileName = `${i + 1}.png`;
    const filePath = path.join(saveDir, fileName);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`Screenshot saved: ${filePath}`);
  }

  // Close the browser
  await browser.close();
})();


//HIDDEN LOCALIZATION PAGES:   bookingform, accomodationform, attractionform, wherestayed