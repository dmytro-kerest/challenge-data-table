var React = require('react')
var ReactPivot = require('react-pivot')
var Emitter = require('wildemitter')
var createReactClass = require('create-react-class')

var rows = require('./data.json')
var showRate = (val) => {
  return isFinite(val) ? `${(val * 100).toFixed(1)}%` : 0
}

var bus = new Emitter
var ReactPivotSaved = JSON.parse(localStorage.ReactPivotSaved || '{}')

bus.on('*', function(event, data) {
  persist(event, data)
})

function persist (prop, val) {
  ReactPivotSaved[prop] = val
  localStorage.ReactPivotSaved = JSON.stringify(ReactPivotSaved)
}

module.exports = createReactClass({
  dimensions: [
    {value: 'date', title: 'Date'},
    {value: 'host', title: 'Host'}
  ],
  calculations: [
    {
      title: 'Impressions',
      value: 'impression',
      className: 'alignRight'
    },
    {
      title: 'Loads',
      value: 'load',
      className: 'alignRight'
    },
    {
      title: 'Displays',
      value: 'display',
      className: 'alignRight'
    },
    {
      title: 'Load Rate',
      value: memo => memo.load / memo.impression,
      template: showRate,
      className: 'alignRight'
    },
    {
      title: 'Display Rate',
      value: memo => memo.display / memo.impression,
      template: showRate,
      className: 'alignRight'
    }
  ],
  reduce: (row, memo) => {
    memo[row.type] = (memo[row.type] || 0) + 1
    return memo
  },
  render () {
    const { 
      activeDimensions,
      sortBy,
      sortDir,
      solo,
      hiddenColumns
     } = ReactPivotSaved
    return (
      <div>
        <div>Report</div>
        <ReactPivot rows={rows}
          dimensions={this.dimensions}
          reduce={this.reduce}
          calculations={this.calculations}
          activeDimensions={activeDimensions || ['Transaction Type']}
          sortBy={sortBy}
          sortDir={sortDir}
          solo={solo}
          hiddenColumns={hiddenColumns}
          eventBus={bus}
        />
      </div>
    )
  }
})
