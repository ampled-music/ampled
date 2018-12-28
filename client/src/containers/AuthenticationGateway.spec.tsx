import { configure, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';

import { AuthenticationGateway } from './AuthenticationGateway';

configure({ adapter: new Adapter() });
jest.mock('store');

describe(`<AuthenticationGateway />`, () => {
  it('renders', () => {
    const authenticationGateway = shallow(<AuthenticationGateway component={() => <div />} path="/test" />);

    expect(authenticationGateway.exists()).toBeTruthy();
  });
});
