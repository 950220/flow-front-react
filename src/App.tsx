import React, { Suspense } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import routes from '../src/router'
function App() {
  return <Suspense fallback={<span>loading</span>}>
    <Router>
      <Switch>
        {
          routes.map(route => <Route exact key={route.path} path={route.path}>
            <route.component />
          </Route>)
        }
      </Switch>
    </Router>
  </Suspense>
}

export default App