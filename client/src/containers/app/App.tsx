import * as React from 'react'
import '../../App.css'
import '../../index.css'

import { AuthenticationGateway } from '../AuthenticationGateway'
import { ProtectedRoutes } from '../ProtectedRoutes'

const App = () => <AuthenticationGateway component={ProtectedRoutes} path="/" />

export { App }
