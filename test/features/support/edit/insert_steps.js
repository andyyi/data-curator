import { expect } from 'chai'
import { Given, When, Then } from 'cucumber'
import {
  getIndexOfCurrentColumnInCurrentRow,
  getIndexOfCurrentRowInRows,
  getNumberOfColumns,
  getNumberOfRows
} from '../page-objects/dimensions'
import { activeTableSelector } from '../page-objects/selectors'

Given(/^the user clicks in row (\d+), column (\d+)$/, async function (rowNumber, colNumber) {
  this.rowNumber = rowNumber
  this.colNumber = colNumber
  this.rowCount = await getNumberOfRows(this.app)
  this.colCount = await getNumberOfColumns(this.app)
  await this.app.webContents.send('selectHotCell', rowNumber, colNumber)
})

When(/^the user (?:performs a |)right-click[s]?$/, function () {
  // by default click in where current cell selection is to avoid unpredictable webdriver behaviour
  return this.app.client
    .element(activeTableSelector)
    .element('.ht_master table tr td.current.highlight')
})

Then(/^the user clicks (?:on|in) "Insert ([Rr]ow|[Cc]olumn) ([bB]elow|[Aa]bove|[Bb]efore|[Aa]fter)"$/, function (rowOrColumn, place) {
  return this.app
    .webContents.send('clickLabelOnContextMenu', `Insert ${rowOrColumn.toLowerCase()} ${place.toLowerCase()}`)
})

Then(/^there should be (\d+) new row[s]? above the current row$/, async function (numberOfNew) {
  let currentRowNumber = await getIndexOfCurrentRowInRows(this.app) + 1
  expect(currentRowNumber).to.equal(this.rowNumber + numberOfNew)
  // let numberOfRows = await getNumberOfRows(this.app)
  // expect(numberOfRows).to.equal(this.rowCount + numberOfNew)
})

Then(/^there should be (\d+) new column[s]? before the current column$/, async function (numberOfNew) {
  let currentColumnNumber = await getIndexOfCurrentColumnInCurrentRow(this.app) + 1
  expect(currentColumnNumber).to.equal(this.colNumber + numberOfNew)
  let numberOfColumns = await getNumberOfColumns(this.app)
  expect(numberOfColumns).to.equal(this.colCount + numberOfNew)
})

Then(/^there should be (\d+) new column[s]? below the current row$/, async function (numberOfNew) {
  let currentRowNumber = await getIndexOfCurrentRowInRows(this.app) + 1
  expect(currentRowNumber).to.equal(this.rowNumber)
  let numberOfRows = await getNumberOfRows(this.app)
  expect(numberOfRows).to.equal(this.rowCount + numberOfNew)
})

Then(/^there should be (\d+) new column[s]? after the current column$/, async function (numberOfNew) {
  let currentColumnNumber = await getIndexOfCurrentColumnInCurrentRow(this.app) + 1
  expect(currentColumnNumber).to.equal(this.colNumber)
  let numberOfColumns = await getNumberOfColumns(this.app)
  expect(numberOfColumns).to.equal(this.colCount + numberOfNew)
})

Then(/^there should be (\d+) row[s]?$/, async function (expectedNumber) {
  let actual = await getNumberOfRows(this.app)
  expect(actual).to.equal(expectedNumber)
})

Then(/^there should be (\d+) column[s]?$/, async function (expectedNumber) {
  let actual = await getNumberOfColumns(this.app)
  expect(actual).to.equal(expectedNumber)
})