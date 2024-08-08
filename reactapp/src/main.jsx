import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import Login from './pages/Login/login';
import Articles from './pages/Articles/articles';
import Register from './pages/Register/register';
import PrivateRoute from './components/PrivateRoute';

/**
 * The main component of the app. It is the one defining the `CookieProvider` and the `Router`.
 * The ´CookieProvider´ provides a centralised way of checking the cookies of the browser from any part of the app using the hook `useCookie()`
 * The `Router` component provides a list of routes and defines which component must render on each route.
 * E.g:
 *    ```
 *         <Routes>
 *           <Route path="/login" element={<Login />} />
 *           <Route path="/register" element={<Register />} />
 *           <Route
 *             path="/articles"
 *             element={<PrivateRoute path="/articles"> <Articles /> </PrivateRoute>}
 *             />
 *         </Routes>
 *     ```
 *    When the user visit the page `HOST_ADDRESS:PORT/login` it will render the `Login` component.
 *    The `PrivateRoute`component is a custom component defined in ./components/PrivateRoute.jsx 
 *    used to verify that the session cookie exists before rendering the `Articles` component.
 * 
 * @returns {Component}
 */
const App = () => {
  return (
    <CookiesProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/articles"
              element={<PrivateRoute path="/articles"> <Articles /> </PrivateRoute>}
            />
            <Route path="/*" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </CookiesProvider>
  );
};

// This is the entry point of the app. It creates the root of your application and it renders the React component `App` inside an HTML element identified with the id `root`.
createRoot(document.getElementById('root')).render(<App />)
