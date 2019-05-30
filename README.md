# \<date-carousel\>

![Screenshot](./screenshot.png)

This is a web component for picking a date in a carousel format. Scrolling through dates changes the week in focus. To learn about usage, check out the tests in `test/date-carousel_test.js`.

## Usage

```
<date-carousel weekinviewport=5 yearinviewport=2019 datepicked=1558526434000></date-carousel>
```

### Attributes
- `weekinviewport`: This determines which week of a year will be shown on first load. If not defined, it will default to the current week. When users change the week in the viewport, the `on-change-week` event is dispatched and the `weekinviewport` value updates. 
- `yearinviewport`: Similar to `weekinviewport`, this determines the year displayed and will also update as users scroll through weeks into years. 
- `datepicked`: This is the unix time in milliseconds of the beginning of the day selected. If not set on load, no date will be selected, but as a date is selected, this attribute will update.

### Events
- `on-day-picked`: When a user selects a day in the carousel, this event will dispatch.
- `on-week-change`: When users move forward or back in the date carousel, this event will dispatch.

## Install
```
npm install --save date-carousel
```

```
import 'date-carousel/date-carousel.js'
```

## Develop
First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

### Viewing Demo 

```
$ polymer serve
```

### Running Tests

```
$ polymer test
```

## Credits
This component is built using [Lit Element](https://github.com/Polymer/lit-element) for the [Tangerine Project](https://github.com/tangerine-community/tangerine).
