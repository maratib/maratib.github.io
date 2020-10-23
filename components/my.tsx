import * as React from 'react'

type Props = {
  name?: string
}

const My = ({ name }: Props) => (
  <h1>{name} go home and sleep</h1>
)

export default My
