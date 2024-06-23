const { firefox } = require("playwright");
const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon"); // Luxon library for date and time manipulation

async function takeScreenshots(
  url,
  buttonSelector,
  dropdownSelector,
  dropdownValue
) {
  const now = DateTime.now().setZone("Asia/Kolkata"); // Get current date and time in Indian Standard Time (IST)
  const currentDate = now.toFormat("yyyy-MM-dd"); // Format current date as YYYY-MM-DD
  const currentTime = now.toFormat("HH-mm"); // Format current time as HH-mm-ss
  const folderPath = path.join(__dirname, `${currentDate}-${currentTime}`);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`Created folder: ${folderPath}`);
  }

  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url);
    await page.waitForSelector(buttonSelector, { visible: true });
    await page.click(buttonSelector);
    await page.waitForTimeout(2000);
    await page.waitForSelector(dropdownSelector, { visible: true });
    await page.selectOption(dropdownSelector, dropdownValue);
    await page.waitForTimeout(10000); // Adjust as necessary
    const screenshotAfterDropdownChange = path.join(
      folderPath,
      `${dropdownValue}.png`
    );
    await page.screenshot({
      path: screenshotAfterDropdownChange,
      fullPage: true,
    });
    console.log(
      `Screenshot after changing dropdown saved as ${screenshotAfterDropdownChange}`
    );
  } catch (error) {
    console.error(`Error: ${error}`);
  } finally {
    await browser.close(); // Close the browser
  }
}

const url = "https://www.nseindia.com/option-chain";
const buttonSelector = ".fullViewBtn";
const dropdownSelector = "#equity_optionchain_select";

const dropDownValues = [
  "NIFTY",
  // "NIFTYNXT50",
  "FINNIFTY",
  "BANKNIFTY",
  "MIDCPNIFTY",
];

dropDownValues.forEach((el) => {
  takeScreenshots(url, buttonSelector, dropdownSelector, `${el}`);
});
