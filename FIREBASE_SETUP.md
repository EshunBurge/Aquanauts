# Connect Aquanauts to Firebase

The site already has the Firebase code built in. It stays in demo mode (browser-only) until you paste your project settings into `js/firebase-config.js`.

## 1. Create the project
1. Go to https://console.firebase.google.com and click **Add project** (name it Aquanauts). Google Analytics is optional.
2. In **Project settings > General > Your apps**, click the web icon (`</>`), register an app, and copy the `firebaseConfig` values.
3. Paste them into `js/firebase-config.js`, replacing each `YOUR_...` placeholder.

## 2. Turn on sign-in
**Build > Authentication > Get started > Sign-in method**: enable **Email/Password** and **Google**.
Then **Authentication > Settings > Authorized domains** and add the domain the site runs on, for example `eshunburge.github.io`.

## 3. Create the database and lock it down
1. **Build > Firestore Database > Create database** (production mode, pick a region near your players).
2. Open the **Rules** tab, paste the contents of `firestore.rules`, and **Publish**.
   Each signed-in person can then read and write only their own record.

## 4. Try it
Open the site, sign up, play, then log in from another browser. Progress, coins and pets follow the account.
In the console you will see one document per person at `students/{uid}`.

## What is stored
`students/{uid}`: first name, last name, email, role, join date, and `state` (adventure progress, quiz results, coins, pets, prizes, profile settings).
Passwords are handled by Firebase Authentication and never stored by the site.

## Before launch with children
Aquanauts is for ages 7 to 12. In the US, collecting personal information from children under 13 needs verifiable parent consent (COPPA); the UK and EU have similar rules. Have a parent or teacher create the account, keep the data collected to a minimum, publish a privacy policy, and get legal advice for your situation.
