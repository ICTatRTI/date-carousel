import { LitElement, html } from 'lit-element'
import '@material/mwc-icon/mwc-icon.js'
import moment from 'moment/src/moment'

/**
 * `date-carousel`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class DateCarousel extends LitElement {

  static get properties() {
    return { 
      datePicked: { 
        type: Number,
        reflect: true
      },
      weekInViewport: { 
        type: Number,
        reflect:true
      },
      yearInViewport: { 
        type: Number, 
        reflect:true 
      }
    };
  }

  constructor() {
    super()
    this.weekInViewport = 0
    this.yearInViewport = 0
    // @TODO 
    this._days = []
    this._month = ''
    this._weekInViewPort = 0
    this._yearInViewPort = 0
  }

  connectedCallback() {
    super.connectedCallback()
    if (!this.weekInViewport) {
      const initialReferenceDate = this.datePicked ? new Date(this.datePicked) : new Date()
      this.weekInViewport = parseInt(moment(initialReferenceDate).format('W'))
      this.yearInViewport = new Date(initialReferenceDate).getFullYear()
    }
  }

  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    if (
      (name === 'weekinviewport' || name === 'yearinviewport')
      &&
      (
        (
          name === 'weekinviewport' && this._weekInViewPort !== newval
        )
        ||
        (
          name === 'yearinviewport' && this._yearInViewPort !== newval
        )
      )
    ) {
      this._weekInViewPort = name === 'weekinviewport' ? newval : this._weekInViewPort 
      this._yearInViewPort = name === 'yearinviewport' ? newval : this._yearInViewPort 
      if (this._weekInViewPort && this._yearInViewPort) this._calculateDays()
    } else if (name === 'datepicked') {
      const datePicked = moment(new Date(parseInt(newval)))
      this.yearInViewport = parseInt(datePicked.format('YYYY'))
      this.weekInViewport = parseInt(datePicked.format('W'))
      this._calculateDays()
    }
  }

  _calculateDays() {
    let days = []
    let currentDayCount = 1
    let currentDay = moment(`${this._yearInViewPort} ${this._weekInViewPort}`, 'YYYY WW')
    let selectedDay = moment(new Date(this.datePicked))
    this._monthYear = currentDay.format('MMMM YYYY')
    while (currentDayCount <= 7) {
      days.push({
        dayOfWeek: currentDay.format('ddd'),
        dayOfMonth: currentDay.format('D'),
        day: currentDay.format('DD'),
        month: currentDay.format('MM'),
        year: currentDay.format('YYYY'),
        class: (selectedDay.format('YYYYMMDD') === currentDay.format('YYYYMMDD')) ? 'selected' : ''
      })
      currentDay.add(1, 'day')
      currentDayCount++
    }
    this._days = days
  }

  _next() {
    const oneWeekLater = moment(`${this._yearInViewPort} ${this._weekInViewPort}`, 'YYYY WW').add(1, 'week')
    this.yearInViewport = parseInt(oneWeekLater.format('YYYY'))
    this.weekInViewport = parseInt(oneWeekLater.format('WW'))
    this.dispatchEvent(new CustomEvent('on-week-change'))
  }

  _back() {
    const oneWeekBack = moment(`${this._yearInViewPort} ${this._weekInViewPort}`, 'YYYY WW').subtract(1, 'week')
    this.yearInViewport = parseInt(oneWeekBack.format('YYYY'))
    this.weekInViewport = parseInt(oneWeekBack.format('WW'))
    this.dispatchEvent(new CustomEvent('on-week-change'))
  }

  _onDayPick(event) {
    const day = event.currentTarget.dataset.day
    const month = event.currentTarget.dataset.month
    const year = event.currentTarget.dataset.year
    this.datePicked = moment(`${year} ${month} ${day}`, 'YYYY MM DD').unix()*1000
    this.dispatchEvent(new CustomEvent('on-day-pick'))
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
        }
        table {
          width: var(--date-carousel-table-width, 100%);
          font-size: var(--date-carousel-table-font-size, 1em);
          color: var(--date-carousel-table-color, #000);
        }
        .month {
          font-size: var(--date-carousel-month-font-size, 1em);
          color: var(--date-carousel-month-color, #000);
        }
        .day-of-week {
          text-align: center;
        }
        .day-of-month {
          text-align: center;
        }
        .selected .day-of-month {
          background: var(--date-carousel-selected-background, #CCC);
          color: var(--date-carousel-selected-color, #000);
          border-radius: 15px;
        }
      </style>
      <div class="month">${this._monthYear}</div>
      <table class="days">
        <tr>
          <td>
            <mwc-icon class="back" @click="${this._back}">chevron_left</mwc-icon>
          </td>
          ${this._days.map(day => html`
            <td @click="${this._onDayPick}" data-day="${day.day}" data-month="${day.month}" data-year="${day.year}" class="day ${day.class}">
              <div class="day-of-week">
                ${day.dayOfWeek}
              </div>
              <div class="day-of-month">
                ${day.dayOfMonth}
              </div>
            </td>
          `)}
          <td>
            <mwc-icon class="forward" @click="${this._next}">chevron_right</mwc-icon>
          </td>
        </tr>
      </table>
    `;
  }

}

window.customElements.define('date-carousel', DateCarousel);
