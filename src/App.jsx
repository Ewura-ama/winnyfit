import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';

import routes from './routes';



function App() {
  

  return (
   <Router>
    
    <Routes>
      {routes.map(({ path, component: Component}, index) => (
        <Route 
          key={index}
          path={path}
          element={
            
              <Component />
     
          }
        />
      ))}
    </Routes>
    {/* <Footer /> */}
   </Router>
  )
}

export default App
