import { LitElement, html } from 'lit-element'
import '@material/mwc-icon/mwc-icon.js'
import { DateTime } from 'luxon'

export const FORMAT_YEAR_WEEK = 'yyyy-c'
export const FORMAT_YEAR_MONTH_DAY = 'yyyy-LL-dd'

/**
 * `date-carousel`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class DateCarousel extends LitElement {

  // We have to list _days as a property otherwise change detection in the lit template doesn't work. 
  static get properties() {
    return { 
      _days: { type: Array },
      useEthiopianCalendar: { type: Boolean }
    };
  }

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()

    var now = DateTime.local()
    if (this.useEthiopianCalendar) {
      now = now.reconfigure({ outputCalendar: 'ethiopic' })
    }

    this.weekInView = now
    this.datePicked = now.toFormat(FORMAT_YEAR_MONTH_DAY)
    this.weekUnixValue = now.toFormat('X') // unix timestamp in seconds
    this.dateUnixValue = now.toFormat('X') // unix timestamp in seconds
    this._calculateDays()
  }

  _calculateDays() {
    let days = []
    let currentDayCount = 1
    let currentDay = this.weekInView
    this._monthYear = currentDay.toFormat('LLLL yyyy')
    while (currentDayCount <= 7) {
      days.push({
        dayOfWeek: currentDay.toFormat('ccc'),
        dayOfMonth: currentDay.toFormat('d'),
        day: currentDay.toFormat('dd'),
        month: currentDay.toFormat('LL'),
        year: currentDay.toFormat('yyyy'),
        unix: currentDay.toFormat('X'),
        class: (this.dateUnixValue === currentDay.toFormat('X')) ? 'selected' : ''
      })
      currentDay = currentDay.plus({days: 1})
      currentDayCount++
    }
    this._days = days
  }

  _next() {
    this.weekInView = this.weekInView.plus({weeks: 1})
    this.weekUnixValue = this.weekInView.toFormat('X')
    this.datePicked = this.weekInView
    this.dateUnixValue = this.datePicked.toFormat('X')
    this._calculateDays()
    this.dispatchEvent(new CustomEvent('on-week-change'))
  }

  _back() {
    this.weekInView = this.weekInView.minus({weeks: 1})
    this.weekUnixValue = this.weekInView.toFormat('X')
    this.datePicked = this.weekInView
    this.dateUnixValue = this.datePicked.toFormat('X')
    this._calculateDays()
    this.dispatchEvent(new CustomEvent('on-week-change'))
  }

  _onDayPick(event) {
    const day = event.currentTarget.dataset.day
    const month = event.currentTarget.dataset.month
    const year = event.currentTarget.dataset.year
    this.datePicked = `${year}-${month}-${day}`
    this.dateUnixValue = event.currentTarget.dataset.unix
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
            width: 1px;
        }
        .clickable {
          cursor: pointer;
        }
      </style>
      <div class="month">${this._monthYear}</div>
      <table class="days">
        <tr>
          <td class="clickable button" @click="${this._back}">
            <mwc-icon class="back">chevron_left</mwc-icon>
          </td>
          ${this._days.map(day => html`
            <td @click="${this._onDayPick}" data-day="${day.day}" data-month="${day.month}" data-year="${day.year}" data-unix="${day.unix}" class="clickable day ${day.class}">
              <div class="day-of-week">
                ${day.dayOfWeek}
              </div>
              <div class="day-of-month">
                ${day.dayOfMonth}
              </div>
            </td>
          `)}
          <td class="clickable button" @click="${this._next}">
            <mwc-icon class="forward">chevron_right</mwc-icon>
          </td>
        </tr>
      </table>
    `;
  }

}

window.customElements.define('date-carousel', DateCarousel);
