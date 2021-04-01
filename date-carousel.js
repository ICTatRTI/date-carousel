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

    this.weekInView = now.startOf("week")
    this.weekUnixValue = now.startOf("week").toFormat('X') // unix timestamp in seconds
    this.datePicked = now.toFormat(FORMAT_YEAR_MONTH_DAY)
    this.dateUnixValue = now.toFormat('X') // unix timestamp in seconds
    this._calculateDays()
  }

  _calculateHeaderText() {
    let firstDayOfWeek = this.weekInView
    let lastDayOfWeek = this.weekInView.plus({days: 6})

    const firstDayOfWeekYear = parseInt(firstDayOfWeek.toFormat('yyyy'))
    const lastDayOfWeekYear = parseInt(lastDayOfWeek.toFormat('yyyy'))

    let headerText
    if (firstDayOfWeekYear !== lastDayOfWeekYear) {
      // the week stradles a new year --- show year text in both strings
      headerText = `${firstDayOfWeek.toFormat('dd LLL yyyy')} - ${lastDayOfWeek.toFormat('dd LLL yyyy')}`
    } else {
      // the week is in the same year --- only show the year at the end
      headerText = `${firstDayOfWeek.toFormat('dd LLL')} - ${lastDayOfWeek.toFormat('dd LLL yyyy')}`
    }
    return headerText
  }

  _calculateDays() {
    let days = []
    let currentDayCount = 1
    let currentDay = this.weekInView

    this._headerText = this._calculateHeaderText()

    while (currentDayCount <= 7) {
      days.push({
        dayOfWeek: currentDay.toFormat('ccc'),
        dayOfMonth: currentDay.toFormat('d'),
        day: currentDay.toFormat('dd'),
        month: currentDay.toFormat('LL'),
        year: currentDay.toFormat('yyyy'),
        unix: currentDay.toFormat('X'),
        class: (this.datePicked === currentDay.toFormat(FORMAT_YEAR_MONTH_DAY)) ? 'selected' : ''
      })
      currentDay = currentDay.plus({days: 1})
      currentDayCount++
    }
    this._days = days
  }

  _next() {
    this.weekInView = this.weekInView.plus({weeks: 1})
    this.weekUnixValue = this.weekInView.toFormat('X')
    this.datePicked = this.weekInView.toFormat(FORMAT_YEAR_MONTH_DAY)
    this.dateUnixValue = this.weekInView.toFormat('X')
    this._calculateDays()
    this.dispatchEvent(new CustomEvent('on-week-change'))
  }

  _back() {
    this.weekInView = this.weekInView.minus({weeks: 1})
    this.weekUnixValue = this.weekInView.toFormat('X')
    this.datePicked = this.weekInView.toFormat(FORMAT_YEAR_MONTH_DAY)
    this.dateUnixValue = this.weekInView.toFormat('X')
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

  _today() {
    var now = DateTime.local()
    if (this.useEthiopianCalendar) {
      now = now.reconfigure({ outputCalendar: 'ethiopic' })
    }

    this.weekInView = now.startOf("week")
    this.datePicked = now.toFormat(FORMAT_YEAR_MONTH_DAY)
    this.weekUnixValue = now.startOf("week").toFormat('X')
    this.dateUnixValue = now.toFormat('X')
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
      <table class="header">
        <tr>
          <td>
            <div class="month">${this._headerText}</div>
          </td>
          <td class="clickable button" @click="${this._today}">
            <button class="today">Today</button>
          </td>
        </tr>
      </table>
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
