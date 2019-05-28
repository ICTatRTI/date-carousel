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
        type: Number 
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
    this.datePicked = Date.now()
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
      // @TODO Calculate week given this.datePicked. Do the momentjs trick where you format to week view then parse that week.
      this.weekInViewport = parseInt(moment(new Date(this.datePicked)).format('W'))
      this.yearInViewport = new Date(this.datePicked).getFullYear()
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
    }
  }

  _calculateDays() {
    let days = []
    let currentDayCount = 1
    let currentDay = moment(`${this._yearInViewPort} ${this._weekInViewPort}`, 'YYYY WW')
    this._monthYear = currentDay.format('MMMM YYYY')
    while (currentDayCount <= 7) {
      days.push({
        dayOfWeek: currentDay.format('ddd'),
        dayOfMonth: currentDay.format('D')
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
  }

  _back() {
    const oneWeekBack = moment(`${this._yearInViewPort} ${this._weekInViewPort}`, 'YYYY WW').subtract(1, 'week')
    this.yearInViewport = parseInt(oneWeekBack.format('YYYY'))
    this.weekInViewport = parseInt(oneWeekBack.format('WW'))
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div class="month">${this._monthYear}</div>
      <table class="days">
        <tr>
          <td>
            <mwc-icon class="back" @click="${this._back}">chevron_left</mwc-icon>
          </td>
          ${this._days.map(day => html`
            <td class="day ${day.selected ? html`selected` : ``}">
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
