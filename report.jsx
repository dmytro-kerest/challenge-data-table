var React = require('react')
var ReactPivot = require('react-pivot')
var Emitter = require('wildemitter')
var createReactClass = require('create-react-class')

var rows = require('./data.json')
var showRate = (val) => {
  return isFinite(val) ? `${(val * 100).toFixed(1)}%` : 0
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
  bus: new Emitter(),
  getInitialState () {
    return JSON.parse(window.localStorage.PivotState || '{}')
  },
  componentWillMount () {
    this.bus.on('*', (event, data) => {
      this.setState({[event]: data})
      window.localStorage.PivotState = JSON.stringify(this.state)
    })
  },
  render () {
    const {
      activeDimensions,
      sortBy,
      sortDir,
      solo,
      hiddenColumns
     } = this.state
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
          eventBus={this.bus}
        />
      </div>
    )
  }
})
