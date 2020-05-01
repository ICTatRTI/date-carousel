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
    return { _days: { type: Array } };
  }

  constructor() {
    super()
    this.week = moment().format('W')
    this.year = moment().format('YYYY')
    this._calculateDays()
  }

  _calculateDays() {
    let days = []
    let currentDayCount = 1
    let currentDay = moment(`${this.year} ${this.week}`, 'YYYY WW')
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
    const oneWeekLater = moment(`${this.year} ${this.week}`, 'YYYY WW').add(1, 'week')
    this.year = parseInt(oneWeekLater.format('YYYY'))
    this.week = parseInt(oneWeekLater.format('WW'))
    this._calculateDays()
    this.dispatchEvent(new CustomEvent('on-week-change'))
  }

  _back() {
    const oneWeekBack = moment(`${this.year} ${this.week}`, 'YYYY WW').subtract(1, 'week')
    this.year = parseInt(oneWeekBack.format('YYYY'))
    this.week = parseInt(oneWeekBack.format('WW'))
    this._calculateDays()
    this.dispatchEvent(new CustomEvent('on-week-change'))
  }

  _onDayPick(event) {
    const day = event.currentTarget.dataset.day
    const month = event.currentTarget.dataset.month
    const year = event.currentTarget.dataset.year
    this.datePicked = moment(`${year} ${month} ${day}`, 'YYYY MM DD').unix()*1000
    this._calculateDays()
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
        mwc-icon {
          font-size: var(--date-carousel-button-font-size, --date-carousel-table-font-size, 1em);
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
        td.button {
            white-space:nowrap;
            width: 1px
        }
      </style>
      <div class="month">${this._monthYear}</div>
      <table class="days">
        <tr>
          <td class="button">
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
          <td class="button">
            <mwc-icon class="forward" @click="${this._next}">chevron_right</mwc-icon>
          </td>
        </tr>
      </table>
    `;
  }

}

window.customElements.define('date-carousel', DateCarousel);
