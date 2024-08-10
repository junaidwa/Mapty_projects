'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// How to get live locations url of google map through JavaScript:
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position);
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;
      console.log(
        `https://www.google.com/maps/@${latitude},${longitude},175.49z?entry=ttu`
      );

      const cords = [latitude, longitude];

      const map = L.map('map').setView(cords, 13); //map is the id of div where we want to show map
      //Here L is a global variable and it's access to all scirpt file that are inclide after the this script in index.html.
      //For example If we have a variable in other.js and other.js incide in index.hmtl before script.js then script.js use this variable.

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //   L.marker(cords)
      //     .addTo(map)
      //     .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      //     .openPopup();

      map.on('click', function (mapEvent) {
        form.classList.remove('hidden');




        // console.log(mapEvent);
        // const { lat, lng } = mapEvent.latlng;
        // L.marker([lat, lng])
        //   .addTo(map)
        //   .bindPopup(
        //     L.popup({
        //       maxWidth: 250,
        //       minWidth: 100,
        //       autoClose: false,
        //       closeOnClick: false,
        //       className: 'running-popup',
        //     })
        //   )
        //   .setPopupContent('Junaid')
        //   .openPopup();
      });
    },
    function () {
      alert('Block to Fetch Data');
    }
  );

  form.addEventListener('submit',function(){
    
  })