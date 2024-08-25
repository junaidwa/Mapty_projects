'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map, mapEvent;

class WorkOut {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(cords, distance, duration) {
    // this.data ...
    // this.id ...
    this.cords = cords; //[]
    this.distance = distance; // km
    this.duration = duration; //in min
  }
  _SetDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}
class Running extends WorkOut {
  type = 'running';
  constructor(cords, distance, duration, cadence) {
    super(cords, distance, duration);
    this.cadence = cadence;
    this.type = 'running';
    this.calcPace();
    this._SetDescription();
  }
  calcPace() {
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends WorkOut {
  type = 'cycling';
  constructor(cords, distance, duration, elevationGain) {
    super(cords, distance, duration);
    this.elevationGain = elevationGain;
    this.type = 'cycling';
    this._SetDescription();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPostion();

    form.addEventListener('submit', this._newWorkOut.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click',this._movePopup.bind(this))
  }

  _getPostion() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Unable to fetch your location');
        }
      );
  }

  _loadMap(position) {
    console.log(position);
    const longitude = position.coords.longitude;
    const latitude = position.coords.latitude;
    console.log(
      `https://www.google.com/maps/@${latitude},${longitude},175.49z?entry=ttu`
    );

    const cords = [latitude, longitude];

    // Assign the map to the global variable no5 const or let
    this.#map = L.map('map').setView(cords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;

    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _hideForm() {
    //Empty input field
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'));
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkOut(e) {
    const ValidInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const AllPositive = (...inputs) => inputs.every(inp => inp > 0);
    e.preventDefault();

    //Get Data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value; //+Sign means convert into number
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    //Check if data is valid

    //If Workout is running then create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      if (
        // !Number.isFinite(distance),
        // !Number.isFinite(duration),
        // !Number.isFinite(cadence)
        !ValidInputs(distance, duration, cadence) ||
        !AllPositive(distance, duration, cadence)
      )
        return alert('Inputs must be positive number');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    //If workout is cycling then create cycling object

    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        // !Number.isFinite(distance),
        // !Number.isFinite(duration),
        // !Number.isFinite(cadence)
        !ValidInputs(distance, duration) ||
        !AllPositive(distance, duration, elevation)
      )
        return alert('Inputs must be positive number');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //Add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);

    //Render workout on map as marker
    this._renderWorkoutMarker(workout);

    //Render workout on list

    this._renderWorkOut(workout);
    // Hide + Clear input fields
    this._hideForm();
  }
  _renderWorkoutMarker(workout) {
    if (this.#mapEvent) {
      L.marker(workout.cords)
        .addTo(this.#map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`,
          })
        )
        .setPopupContent(
          `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
        )
        .openPopup();
    }
  }
  _renderWorkOut(workout) {
    let html = `
  <li class="workout workout--${workout.type}" data-id=${workout.id}>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
    `;
    if (workout.type === 'running') {
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>

      `;
    }
    if (workout.type === 'cycling') {
      html += ` <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${this.speed.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
    }
    form.insertAdjacentHTML('afterend', html);
  }
  _movePopup(e){
    const WorkEL = e.target.closest('.workout');
    // console.log(WorkEL)

    if(!WorkEL) return;
    let workoutdata = this.#workouts.find(work => work.id === WorkEL.dataset.id);
    console.log(workoutdata)


 this.#map.setView(workoutdata.cords,13,{
 animate:true,
 pan:{
 duration:1
 }

 })


  }
}

const app = new App();
app._getPostion;
