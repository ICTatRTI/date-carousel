# CHANGELOG

## v5.2.1
- Fix setting of week unix timestamp value when the 'today' button is clicked

## v5.2.0
- Improved the month header text
- make Monday the first day of the week in the carousel
- Add unix timestamp values in seconds to the API as DateCarousel.weekUnixValue and DateCarousel.dateUnixValue
- Add a 'Today' button which resets the carousel to today's date
- Change the logic when clicking forward or backward to select the first day of the new week.

## v5.1.0
- Add support for Ethiopian Calendar. Use the `useEthiopianCalendar` attribute. Example: `<date-carousel useEthiopianCalendar></date-carousel>`.

## v5.0.0
- Standardize on API of DateCarousel.weekInView and DateCarousel.datePicked in moment formats of 'YYYY-w' and 'YYYY-MM-DD'.

## v4.0.0
- Fix issue causing week to start on Monday.
- Standardize on moment format 'YYYY' for year and moment format 'w' for week.

## v3.0.0
- Fix timezone errors in DateCarousel.datePicked API to be formatted as YYYY-MM-DD, not unix timestamp. 

## v2.0.0
- Upgraded to lit-element v2.3.1 but had to drop support for setting year/week/selection on component init via attributes.

## v1.2.1
- Fix column spacing for buttons and make button size overideable.

## v1.2.0
- Added use of CSS variables for parent apps to override.

## v1.1.0
- Added support for dispatching `on-week-change` and `on-date-pick` events.

## v1.0.0
Initial version with complete test coverage.
