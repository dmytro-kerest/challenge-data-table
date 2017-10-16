var React = require('react')
var ReactPivot = require('react-pivot')
var createReactClass = require('create-react-class')

var rows = require('./data.json')
var showRate = (val) => {
  return isFinite(val) ? `${(val*100).toFixed(1)}%` : 0
}

module.exports = createReactClass({
  dimensions: [
    {value: 'date', title: 'Date'},
    {value: 'host', title: 'Host'}
  ],
  reduce: (row, memo) => {
    memo[row.type] = (memo[row.type] || 0) + 1
    return memo
  },
  calculations: [
    {
      title: 'Impressions',
      value: 'impression',
      template: val => val
    },
    {
      title: 'Loads',
      value: 'load',
      template: val => val
    },
    {
      title: 'Displays',
      value: 'display',
      template: val => val
    },
    {
      title: 'Load Rate',
      value: memo => memo.load / memo.impression,
      template: showRate
    }
    ,
    {
      title: 'Display Rate',
      value: memo => memo.display / memo.impression,
      template: showRate
    }  ],
  render () {
    return (
      <div>
        <div>Report</div>
        <ReactPivot rows={rows}
          dimensions={this.dimensions}
          reduce={this.reduce}
          calculations={this.calculations}
        />
      </div>
    )
  }
})
