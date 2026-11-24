# SmartCare working frontend prototype

## Run it on Windows
1. Install Node.js (if it is not installed).
2. Extract this ZIP.
3. Open the extracted `smartcare-prototype` folder in VS Code.
4. Open Terminal > New Terminal.
5. Run:

   npm install

6. When installation finishes, run:

   npm run dev

7. Open the local URL shown in the terminal (usually http://localhost:5173).

## What works
- Dashboard with device and alert counts.
- Add, edit, search and remove electronic devices.
- Device categories covering common electronics plus Other.
- Warranty tracker and upcoming warranty/service date reminders (within 30 days).
- Sample repair-shop directory.
- Product Care Passport activity timeline; use the wrench icon on a device to record a service activity.
- Device list and activity are saved in this browser using localStorage.

## Prototype limitations
This is a frontend prototype. It does not yet have user accounts, a backend, MySQL database, real notifications, uploaded bill storage, verified live repair-shop results, or live maps. The repair-shop cards are demo listings and should not be treated as verified businesses. Data is stored in the browser on the device where you run it.
