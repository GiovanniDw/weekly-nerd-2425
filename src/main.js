import { getData, fixGroupData,fixCustomData } from './js/data.js';

const $ = (x) => document.querySelector(x);
const $$ = (x) => document.querySelectorAll(x);



// https://directus.io/docs/guides/connect/query-parameters 

const baseURL = 'https://fdnd.directus.app/items/person/';
const filterMe = '?filter={"id":237}'
const filterGroup = '?filter={"_and":[{"squads":{"squad_id":{"tribe":{"name":"CMD Minor Web Dev"}}}},{"squads":{"squad_id":{"cohort":"2425"}}}]}'
const dataMeURL = 'https://fdnd.directus.app/items/person/?filter={"id":237}';
const dataGroupURL = `https://fdnd.directus.app/items/person/?filter={"_and":[{"squads":{"squad_id":{"tribe":{"name":"CMD Minor Web Dev"}}}},{"squads":{"squad_id":{"cohort":"2425"}}}]}`;
const filterBday = '&sort=-birthdate'
const customHairColor = 'https://fdnd.directus.app/items/person/?fields=*,squads.squad_id.name,squads.squad_id.cohort&filter={"_and":[{"squads":{"squad_id":{"tribe":{"name":"CMD Minor Web Dev"}}}},{"squads":{"squad_id":{"cohort":"2425"}}},{"custom":{"_contains":"haarkleur"}}]}';


const groupData = await getData(baseURL+filterGroup);

const fixedGroupData = fixGroupData(groupData.data);


const personalData = await getData(baseURL+filterMe);
const fixedPersonalData = fixCustomData(personalData.data);
const template = $('template')
const app = $('#app')
const engine = new liquidjs.Liquid()

let src = "<h2>Welcome to {{ myData.name }}</h2>";
console.log('fixedPersonalData')
console.log(fixedPersonalData)

console.log(personalData.data[0])

let ctx = {
  personal: personalData.data[0],
  persons: fixedGroupData,
  name: 'Liquid',
  date: new Date()
};


engine.parseAndRender(template.innerHTML, ctx)
  .then(function(html) {
    app.innerHTML = html
  });



  // window.addEventListener('load', () => {
  //   setTimeout(() => {
  //     if (document.getElementById('flip-card')) {
  //       document.getElementById('flip-card').classList.add('is-flipped');

  //     }

      
  //   }, 2000); // Flip na 2 seconden
// });
  