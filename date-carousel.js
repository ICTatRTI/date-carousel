import { LitElement, html } from 'lit-element'
import '@material/mwc-icon/mwc-icon.js'
import moment from 'moment/src/moment'

export const FORMAT_YEAR_WEEK = 'YYYY-w'
export const FORMAT_YEAR_MONTH_DAY = 'YYYY-MM-DD'

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
    return { _days: { type: Array } };
  }

  constructor() {
    super()
    this.weekInView = moment().format(FORMAT_YEAR_WEEK)
    this.datePicked = moment().format(FORMAT_YEAR_MONTH_DAY)
    this._calculateDays()
  }

  _calculateDays() {
    let days = []
    let currentDayCount = 1
    let currentDay = moment(this.weekInView, FORMAT_YEAR_WEEK)
    while (currentDayCount <= 7) {
      days.push({
        dayOfWeek: currentDay.format('ddd'),
        dayOfMonth: currentDay.format('D'),
        day: currentDay.format('DD'),
        month: currentDay.format('MM'),
        year: currentDay.format('YYYY'),
        class: (moment(this.datePicked).format('YYYYMMDD') === currentDay.format('YYYYMMDD')) ? 'selected' : ''
      })
      currentDay.add(1, 'day')
      currentDayCount++
    }
    this._days = days
    this._monthYear = currentDay.format('MMMM YYYY')
  }

  _next() {
    this.weekInView = moment(this.weekInView, FORMAT_YEAR_WEEK)
      .add(1, 'week')
      .format(FORMAT_YEAR_WEEK)
    this._calculateDays()
    this.dispatchEvent(new CustomEvent('on-week-change'))
  }

  _back() {
    this.weekInView = moment(this.weekInView, FORMAT_YEAR_WEEK)
      .subtract(1, 'week')
      .format(FORMAT_YEAR_WEEK)
    this._calculateDays()
    this.dispatchEvent(new CustomEvent('on-week-change'))
  }

  _onDayPick(event) {
    const day = event.currentTarget.dataset.day
    const month = event.currentTarget.dataset.month
    const year = event.currentTarget.dataset.year
    this.datePicked = `${year}-${month}-${day}`
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
            <td @click="${this._onDayPick}" data-day="${day.day}" data-month="${day.month}" data-year="${day.year}" class="clickable day ${day.class}">
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
