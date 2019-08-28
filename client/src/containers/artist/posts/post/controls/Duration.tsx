import * as React from 'react';

const format = (seconds) => {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`
  }
  return `${mm}:${ss}`
}

const pad = (string) => {
  return ('0' + string).slice(-2)
}

const Duration = ({ className, seconds } = this.props) => {
    return (
      <time dateTime={`P${Math.round(seconds)}S`} className={className}>
        {format(seconds)}
      </time>
    )
}

export { Duration };