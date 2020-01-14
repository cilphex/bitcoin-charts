import React from "react"
import BasicChart from './components/BasicChart'

export default function() {
  return (
    <div>
      <h1>Bitcoin's Never Look Back Price</h1>
      <p className="intro">
        As described in {' '}
        <a href="https://www.caneislandcrypto.com/blog/2019/10/5/why-bitcoin-is-never-looking-back">this article</a>
        {' '} by {' '}
        <a href="https://twitter.com/nsquaredcrypto">Timothy Peterson</a>
      </p>

      <BasicChart />
    </div>
  )
}