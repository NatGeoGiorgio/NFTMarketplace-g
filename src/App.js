import React, { Component } from "react";
import Home from "./component/Home/Home.js";
import MrktPlace from "./component/MrktPlace/MrktPlace.js";
import Navbar from "./component/utils/navbar/Navbar.js"
import Footer from "./component/footer/Footer.js"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./App.css";
import publish from "./component/publish/publish.js";
import Web3Info from "./component/utils/web3/web3info.js";
import myCoin from "./component/myCoin/myCoin.js";
import CoolAnimation from "./component/utils/animation/coolAnimation.js";
import Countup from "./component/utils/animation/Countup/Countup.js";
//import './App.css';

function App() {
  return (
    <div className = 'background' >
    <Router forceRefresh={true} >
        <Navbar />
        <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/MrktPlace' component={MrktPlace} />
        <Route path='/publish' component={publish} />
        <Route  path='/web3info' component={Web3Info} />
        <Route path='/myCoin' component={myCoin} />
        <Route path='/anim' component={CoolAnimation} />
        {/* <Route path='/anim' component={Countup} /> */}
        </Switch>
        {/* <Footer /> */}
    </Router>
    </div>
  );
}

export default App;

// class App extends Component {
//   constructor(props) {    
//     super(props);

//     this.state = {
//       route: window.location.pathname.replace("/", ""),
//     };
//   }


//   renderHome() {
//     return (
//       <div>
//         <Home />
//       </div>    
//     );
//   }

//   renderMrktPlace() {
//     return (
//       <div>
//         <MrktPlace />
//       </div>    
//     );
//   }

//   render() {
//     return (
//       <div>
//         < Navbar/>
//           {this.state.route === '' && this.renderHome()}
//           {this.state.route === 'MrktPlace' && this.renderMrktPlace()}
//       </div>
//     );
//   }
// }

// export default App;

