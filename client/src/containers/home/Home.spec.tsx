import { configure, shallow } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'

import { Home } from './Home2'

configure({ adapter: new Adapter() })

describe(`<Home />`, () => {
  it('renders', () => {
    const homeComponent = shallow(<Home />)

    expect(homeComponent.exists()).toBeTruthy()
  })
})
