# Expressjs Middleware Block or Allow IP Range

**without dependencies**

## [how to use middleware in expressjs](http://expressjs.com/en/guide/writing-middleware.html)

## Getting Started

```js
const IPRange = require('ip-range-middleware')
```

## Usage

Allow only 127.0.0.1

```js
app.use(IPRange([
  [127], [0], [0], [1]
]))
```


Allow only the range from 192.168.178.1 to 192.168.178.128

```js
app.use(IPRange([
  [192], [168], [178], [1, 128]
]))
```


Allow only two addresses

```js
app.use(IPRange([
  [192], [168], [178], [2],
  [127], [0], [0], [1]
]))
```


Allow only ::1

```js
app.use(IPRange([], { allow: ['::1'] }))
```