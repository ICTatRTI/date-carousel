import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `date-carousel`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class DateCarousel extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'date-carousel',
      },
    };
  }
}

window.customElements.define('date-carousel', DateCarousel);
