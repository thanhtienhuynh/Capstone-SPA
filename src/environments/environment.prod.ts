import { Province } from "src/app/admin/view-models";

export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: "AIzaSyBHrI1bDdG56ELUdBh05f3yOkNliAy8GUY",
    authDomain: "unilinks-41d0e.firebaseapp.com",
    projectId: "unilinks-41d0e",
    storageBucket: "unilinks-41d0e.appspot.com",
    messagingSenderId: "1039354207577",
    appId: "1:1039354207577:web:aa6c8dd47b91a492670048",
    measurementId: "G-4HT7GTTN56"
  },
  apiUrl: 'https://mohs.azurewebsites.net/',
  // apiUrl: 'https://mohsdev.azurewebsites.net/',
  nation: {id: 1000, name: 'TOÀN QUỐC', regionId: 1} as Province,
  initSeasonId: 5
};
