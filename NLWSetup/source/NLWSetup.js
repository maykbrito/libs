/**
 * @classdesc This class will be used in NLW #11 Setup and will help students
 * to create the event's project by simplifying several JS concepts.
 */
var NLWSetup = class NLWSetup {
  /** 
   * Object that contains the data composed by
   * 
   * **key**: The habit name as the `data-name` of the `.habit` container
   * **value**: `Array` of days to be checked as done
   * **day**: Each day must be like the format `MM-DD` _MM: month, DD: day_
   * 
   * 
   * ```js
   *  { run: ['01-01', '01-02', '01-06'] }
   * ```
   * @private
   */
  data = {}

  /**
   * Array of habits
   * camelCase: `run, eatFood`
   * @private
   */
  habits = []

  /**
   * `new Set()` of days to build the display of habits by days
   * @private
   */
  days = new Set()

  /**
   * You must build the `HTML` structure like this
   * 
   * ```html
   * <form>
   *   <div class="habits">
   *     <div class="habit" data-name="run">🏃🏽‍♂️</div>
   *     <div class="habit" data-name="water">💧</div>
   *     <div class="habit" data-name="food">🍎</div>
   *   </div>
   * 
   *   <div class="days"></div>
   * </form>
   * ```
   * 
   * Example of usage
   * 
   * ```js
   * const form = document.querySelector('form')
   * const nlwSetup = new NLWSetup(form)
   * ```
   * 
   * @param {HTMLFormElement} form
   * 
   */
  constructor(form) {
    this.form = form
    this.daysContainer = this.form.querySelector(".days")
    this.form.addEventListener("change", () => this.#update())
    this.createHabits()
    this.load()
  }

  /**
   * It will load the internal [data](#data) and [render the layout](#renderLayout)
   * 
   */
  load() {
    const hasData = Object.keys(this.data).length > 0
    if (!hasData) return

    this.#registerDays()
    this.renderLayout()
  }

  #registerDays() {
    Object.keys(this.data).forEach((key) => {
      this.data[key].forEach((date) => {
        this.days.add(date)
      })
    })
  }

  /**
   * Will render the layout by checking the registered days of the habits data
   * Each day that was included in the habits data, will be checked in the input layout
   * 
   * The `<div class="days"></div>` container will be filled with html, 
   * repeating the .day container for every day registered
   * 
   * example 
   ```html
    <div class="day">
        <div>01/01</div>
        <input type="checkbox" name="run" value="01/01"/>
        <input type="checkbox" name="water" value="01/01"/>
        <input type="checkbox" name="food" value="01/01"/>
    </div>
   ```
   *
   */
  renderLayout() {
    this.daysContainer.innerHTML = ""
    for (let date of this.#getSortedDays()) {
      const [month, day] = date.split("-")
      this.#createDayElement(day + "/" + month)
    }
  }

  createHabits() {
    this.form
      .querySelectorAll(".habit")
      .forEach((habit) => this.#addHabit(habit.dataset.name))
  }

  /**
   * @param {string} habit
   * camelCase: `run, eatFood`
   * @return {NLWHabits} this
   */
  #addHabit(habit) {
    this.habits = [...this.habits, habit]
    return this
  }

  /**
   * @param {string} date `DD/MM`
   * - `DD` day with 2 digits (01-31)
   * - `MM` month with 2 digits (01-12)
   
   * @return {string} `MM-DD`
   */
  #getFormattedDate(date) {
    const [day, month] = date.split("/")
    return month + "-" + day
  }

  /**
   * Get form input values by input name,
   * and format an object:
   * - ` { inputName: ["value1", "valueN", ...]} `
   *
   * Add the object to this.data
   */
  #update() {
    const formData = new FormData(this.form)
    const prepareData = {}
    for (let habit of this.habits) {
      prepareData[habit] = formData.getAll(habit)
    }

    this.setData(prepareData)
  }

  /**
   * The data to build the habits table
   *
   * Example of usage
   * 
   * ```js
   * const data = { 
   *   run: ['01-01', '01-02', '01-06'], 
   *   water: ['01-04', '01-05'],
   *   food: ['01-01', '01-03'],
   * }
   * 
   * nlwSetup.setData(data)
   * ```
   * 
   * @param {object} data Object that contains the data composed by
   * 
   * - key: The habit name as the `data-name` of the `.habit` container
   * - value: `Array` of days to be checked as done
   * 
   * _Each day must be like the format `MM-DD` 
   * where `MM`: is the month and `DD`: is the day_
   * 
   * ```js
   *  { run: ['01-01', '01-02', '01-06'] }
   * ```
   */
  setData(data) {
    if (!data) {
      throw "Object data is needed { habitName: [...days: string]"
    }
    this.data = data
  }

  #getSortedDays() {
    return [...this.days].sort()
  }

  /**
   * Check if day already exists in the set of days
   * 
   * example of usage
   * ```js
   * nlwSetup.dayExists('31/12') // true or false
   * ```
   * 
   * @param {string} date `DD/MM`
   * - `DD` day with 2 digits (01-31)
   * - `MM` month with 2 digits (01-12)
   *
   * @return {boolean}
   */
  dayExists(date) {
    const formattedDate = this.#getFormattedDate(date)
    return [...this.days].includes(formattedDate)
  }
  /**
   * Add a day to registered days and render the layout after that
   * 
   * example of usage
   * ```
   * nlwSetup.addDay('31/12')
   * ```
   * @param {string} date `DD/MM`
   * - `DD` day with 2 digits (01-31)
   * - `MM` month with 2 digits (01-12)
   */
  addDay(date) {
    if (!date || !date?.includes("/")) return
    if (this.dayExists(date)) return
    this.days.add(this.#getFormattedDate(date))
    this.renderLayout()
  }

  /**
   * @param {string} date `DD/MM`
   * - `DD` day with 2 digits (01-31)
   * - `MM` month with 2 digits (01-12)
   */
  #createDayElement(date) {
    const divDay = document.createElement("div")
    divDay.setAttribute("class", "day")
    divDay.innerHTML = `<div>${date}</div>` + this.createCheckboxes(date)
    this.daysContainer.append(divDay)
  }

  createCheckboxes(date) {
    const formattedDate = this.#getFormattedDate(date)
    let checkboxes = ""
    for (let habit of this.habits) {
      checkboxes += `<input 
        type="checkbox" name="${habit}" value="${formattedDate}" 
        ${this.data[habit]?.includes(formattedDate) && "checked"}/>`
    }

    return checkboxes
  }
}
