# babel-transform-shorthands

This library export babel plugin `transformShorthandsPlugin` to transform shorthands in makeStyles call into constant `SHORTHANDS_KEYWORD_FOR_EASY_REPLACE`.
It also export a helper `transformShorthandsHelper` to transform the constant into `...shorthands`.

It's like this for now because I can't get babel to accept `...` spread :/

## Running unit tests

Run `nx test babel-transform-shorthands` to execute the unit tests via [Jest](https://jestjs.io).
