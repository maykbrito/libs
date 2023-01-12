var NLWSetup = class NLWSetup {
  /**
   * Contains the data composed with
   * key: habit name
   * value: array of days were habit has done
   *
   * { habitName: ['01-01', '01-02'] }
   */
  data = {}

  /**
   * Array of habits
   * camelCase: `run, eatFood`
   */
  habits = []

  /**
   * Days to build the display of habits
   */
  days = new Set()

  /**
   * @param {HTMLFormElement} form
   */
  constructor(form) {
    this.form = form
    this.daysContainer = this.form.querySelector(".days")
    this.form.addEventListener("change", () => this.#update())
    this.createHabits()
    this.load()
  }

  /**
   * Will get the data and recreate the layout with that
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

  renderLayout() {
    this.daysContainer.innerHTML = ""
    for (let date of this.getSortedDays()) {
      const [month, day] = date.split("-")
      this.createDayElement(day + "/" + month)
    }
  }

  createHabits() {
    this.form
      .querySelectorAll(".habit")
      .forEach((habit) => this.addHabit(habit.dataset.name))
  }

  /**
   * @param {string} habit
   * camelCase: `run, eatFood`
   * @return {NLWHabits} this
   */
  addHabit(habit) {
    this.habits = [...this.habits, habit]
    return this
  }

  /**
   * @param {string} date `DD/MM`
   * - `DD` day with 2 digits (01-31)
   * - `MM` month with 2 digits (01-12)
   
   * @return {string} `MM-DD`
   */
  getFormattedDate(date) {
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
   * @param {object} data
   * @property {array} data[key] - The array of days
   */
  setData(data) {
    if (!data) {
      throw "Object data is needed { habitName: [...days: string]"
    }
    this.data = data
  }

  /**
   * Get all registered days and sort it from JAN to DEC
   * @return {Array} this.days
   */
  getSortedDays() {
    return [...this.days].sort()
  }

  /**
   * @param {string} date `DD/MM`
   * - `DD` day with 2 digits (01-31)
   * - `MM` month with 2 digits (01-12)
   *
   * @return {boolean} day exists
   */
  dayExists(date) {
    const formattedDate = this.getFormattedDate(date)
    return [...this.days].includes(formattedDate)
  }
  /**
   * @param {string} date `DD/MM`
   * - `DD` day with 2 digits (01-31)
   * - `MM` month with 2 digits (01-12)
   */
  addDay(date) {
    if (!date || !date?.includes("/")) return
    if (this.dayExists(date)) return
    this.days.add(this.getFormattedDate(date))
    this.renderLayout()
  }

  /**
   * @param {string} date `DD/MM`
   * - `DD` day with 2 digits (01-31)
   * - `MM` month with 2 digits (01-12)
   */
  createDayElement(date) {
    const divDay = document.createElement("div")
    divDay.setAttribute("class", "day")
    divDay.innerHTML = `<div>${date}</div>` + this.createCheckboxes(date)
    this.daysContainer.append(divDay)
  }

  createCheckboxes(date) {
    const formattedDate = this.getFormattedDate(date)
    let checkboxes = ""
    for (let habit of this.habits) {
      checkboxes += `<input 
        type="checkbox" name="${habit}" value="${formattedDate}" 
        ${this.data[habit]?.includes(formattedDate) && "checked"}/>`
    }

    return checkboxes
  }
}
