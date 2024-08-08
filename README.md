Handling Authentication and Authorization in React 

 

Authentication 

Authorization 

Authentication verifies who the user is. 

Authorization determines what resources a user can access. 

Authentication works through passwords, one-time pins, biometric information, and other information provided or entered by the user. 

Authorization works through settings that are implemented and maintained by the server. 

Authentication is the first step of a good identity and access management process. 

Authorization always takes place after authentication. 

Authentication is visible to and partially changeable by the user. 

Authorization isn’t visible to or changeable by the user. 

In order to achieve this functionality in our app, we are going to make some changes: 

We must create the corresponding views: 

Login view: Is the view containing the login form. The user will have to enter his email and password to enter the system. 

Register view: Is the view containing the register form. Used to create a new account. 

Articles view: Is the view we already have. Although we have make some changes to transform it to a React Functional Component the functionality is still the same. 

We have to create the different routes for our app: 

/login will redirect to the Login form 

/register will redirect to the Register form 

/articles will redirect to the Articles List. This view is protected and the user must be logged in to enter this screen. 

We are going to create a custom component to handle the authorization to the article list. 

The project structure should look similar to this: 

 

Let’s see one by one the changes. 

We have two new dependencies in our project: 

 

Run npm install in the project root to install them. 

main.jsx 

Our main.jsx script is going to render the App component in the #root element of our HTML. The App component is like this: 

 

This component will define the tree with the different routes of our app. Every time react matches a path defined here, it will render the component that is specified in the Route. 

The CookieProvider is the component provided by the react-cookie library. This is useful to manage the browser cookies across the app. 

/pages/Articles/articles.jsx 

The functionality within this component hasn’t changed although we have converted it to a functional component.  

A functional component is nothing but a pure JS function. It is less amount of code than a class component, it is easier to read, and it allows us to use react hooks (like useState, useEffect, useProvider...). It is the standard way of creating React components today. 

Hooks are functions that let you “hook into” React state and lifecycle features from function components. 

The useEffect hook allows us to run code when the component is rendered. It is the equivalent to the componentDidMount() function of a class component. 

 

The useState hook allows us to manage the state of the component. It is the equivalent of using this.state in a class component. The hook returns two properties (usually get using the array destructuring syntax): the value itself and the function used to set that value. When we call the useState hook we pass as parameter the initial value of the state. 

 

Note that React hooks can only be used inside a component function component or another hook, otherwise we will get an error. 

React Hook "useState" is called in function "testFunction" that is neither a React function component nor a custom React Hook function. 

 

 

 

/pages/Login/login.jsx 

This is the page showing the login form to the user. The form is plain HTML. In here you can add different styles either using Bootstrap, Material design or your own CSS. 

 

Notice the onClick action on the Login button. This is the handler function that will be executed when the button is clicked. 

For simplicity reasons, we are going to hardcode the credentials by now. 

 

/pages/Register/register.jsx 

The register form. There is no real functionality implemented yet. 

 

As in the login.jsx, each text field has a onChange property. This property will be the function that is executed whenever a value change happens in the textfield. In this case, we are calling the setName and setEmail functions to store the value of the field in the state of the component. 

 

/components/PrivateRoute.jsx 

This is a custom component we are going to use to check whether the session cookie exists in the browser or not. It receives two parameters, the path to redirect if the cookie doesn’t exist and the children component to render if the cookie exists. The Outlet is used as a placeholder.  It renders the child route's element, so in this case it renders nothing. 

 

 

Inspecting the app. 

Open the inspector of the browser and go to the Application tab. 

 

Try to navigate to /articles. You should be redirected to /login. 

Enter some wring credentials and click Login. 

 

Enter the correct credentials (email@example.com / password) and click Login 

 

Inspect the network tab for the request being done to the backend. The session cookie is being sent to the server automatically. 

 

 

Full source code 

 

/components/PrivateRoute.jsx 

 

/pages/Articles/articles.jsx 

/pages/Login/login.jsx 

/pages/Register/register.jsx 

Main.jsx 

 

/* eslint-disable react/prop-types */ 

import { Navigate, Outlet } from 'react-router-dom'; 

import { useCookies } from 'react-cookie'; 

 
 

/** 

* Component to check whether the session cookie exists or not. 

* If exists, it redirects to the provided `children` component. 

* Otherwise, does nothing. 

*  

* @param {String} redirectPath  

* @param {Component} children  

* @returns  

*/ 

const PrivateRoute = ({ 

redirectPath = '/login', 

children, 

}) => { 

const [cookies] = useCookies(['session']); 

 
 

if (!cookies.session) { 

return <Navigate to={redirectPath} replace />; 

} 

 
 

return children ? children : <Outlet />; 

}; 

 
 

export default PrivateRoute; 

 
 

 

import { useEffect, useState } from 'react'; 

 
 

// In order to use react hooks like the `useCookies` hook, the must use functional components. 

// Functional components are the industry standard for the react components at the moment. 

// Class components vs Functional components: https://www.geeksforgeeks.org/differences-between-functional-components-and-class-components/ 

const Articles = () => { 

const [articles, setArticles] = useState([]) 

const [loading, setLoading] = useState(true) 

 
 

useEffect(() => { 

populateArticleData(); 

}, []) 

 
 

const populateArticleData = async () => { 

const response = await fetch('/home'); 

const data = await response.json(); 

setArticles(data) 

setLoading(false) 

} 

 
 

const renderArticlesTable = (articles) => { 

return ( 

<table className='table table-striped' aria-labelledby="tabelLabel"> 

<thead> 

<tr> 

<th>Title</th> 

<th>Summary</th> 

<th>Link</th> 

<th>Published</th> 

<th>Topic</th> 

</tr> 

</thead> 

<tbody> 

{articles.map(article => 

<tr key={article.title}> 

<td>{article.title}</td> 

<td>{article.summary}</td> 

<td><a href={article.link} target="_blank" rel="noopener noreferrer">{article.link}</a></td> 

<td>{article.published}</td> 

<td>{article.topic.join(", ")}</td> 

</tr> 

)} 

</tbody> 

</table> 

); 

} 

 
 

return ( 

<div> 

<h1 id="tabelLabel">Article List</h1> 

{loading 

? <p><em>Loading...</em></p> 

: renderArticlesTable(articles)} 

</div > 

); 

} 

 
 

export default Articles; 

 
 

import { useState } from 'react'; 

import { useNavigate } from 'react-router-dom'; 

import { useCookies } from 'react-cookie'; 

 

const Login = () => { 

const [email, setEmail] = useState(''); 

const [password, setPassword] = useState(''); 

const navigate = useNavigate(); 

const [, setCookie] = useCookies(['session']); 

 

const handleLogin = () => { 

// Verify credentials. E.g: do a network request 

// In this case we are hardcoding the credentials. 

if (email === 'email@example.com' && password === 'password') { 

// Store the session cookie in the browser. 

// 

// It is not recomended to store sessions cookies or any other sensitive information in the `localStorage`.  

// It is possible to do Cross-Site-Scripting (XSS) to the `localStorage`. 

// Another option would be to store the session in the `sessionStorage`. This storage is removed when the browser is closed. 

// `Cookies` are not accesible via JS. 

setCookie('session', 'email@example.com', { path: '/' }); 

// Navigate to articles  

navigate('/articles'); 

} else { 

// Show an alert if authentication fails 

alert('Wrong credentials.'); 

} 

}; 

 

// TODO: add styles 

return ( 

<div> 

<h1>Login</h1> 

<form> 

<div> 

<label>Email:</label> 

<input 

type="email" 

value={email} 

onChange={(e) => setEmail(e.target.value)} 

/> 

</div> 

<div> 

<label>Password:</label> 

<input 

type="password" 

value={password} 

onChange={(e) => setPassword(e.target.value)} 

/> 

</div> 

<button type="button" onClick={handleLogin}> 

Login 

</button> 

<a type="button" href="/register"> 

Create a new account 

</a> 

</form> 

</div> 

); 

}; 

 

export default Login; 

 

import { useState } from 'react'; 

import { useNavigate } from 'react-router-dom'; 

 
 

const Register = () => { 

const [name, setName] = useState(''); 

const [email, setEmail] = useState(''); 

const [password, setPassword] = useState(''); 

const history = useNavigate(); 

 
 

const handleRegister = () => { 

// In here you can star the registering process. E.g: make a network request to create the user in the system. 

// After a successful register, redirect to /login 

history.push('/login'); 

}; 

 
 

// TODO: add styles 

return ( 

<div> 

<h1>Register</h1> 

<form> 

<div> 

<label>Name:</label> 

<input 

type="text" 

value={name} 

onChange={(e) => setName(e.target.value)} 

/> 

</div> 

<div> 

<label>Email:</label> 

<input 

type="email" 

value={email} 

onChange={(e) => setEmail(e.target.value)} 

/> 

</div> 

<div> 

<label>Password:</label> 

<input 

type="password" 

value={password} 

onChange={(e) => setPassword(e.target.value)} 

/> 

</div> 

<button type="button" onClick={handleRegister}> 

Register 

</button> 

</form> 

</div> 

); 

}; 

 
 

export default Register; 

 

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

* ``` 

* <Routes> 

* <Route path="/login" element={<Login />} /> 

* <Route path="/register" element={<Register />} /> 

* <Route 

* path="/articles" 

* element={<PrivateRoute path="/articles"> <Articles /> </PrivateRoute>} 

* /> 

* </Routes> 

* ``` 

* When the user visit the page `HOST_ADDRESS:PORT/login` it will render the `Login` component. 

* The `PrivateRoute`component is a custom component defined in ./components/PrivateRoute.jsx  

* used to verify that the session cookie exists before rendering the `Articles` component. 

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

 
 

 