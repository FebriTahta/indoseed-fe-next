
"use client"
import "./globals.scss";
import { Provider } from "react-redux";
import store from "../shared/redux/store";
import PrelineScript from "./PrelineScript";
import {   useState } from "react";
import { Initialload } from "../shared/layouts-components/contextapi";


const RootLayout = ({children}) =>{
  const [pageloading , setpageloading] = useState(false)
    return(
      <html lang="en">
        <body>
          <Provider store={store}>
            <Initialload.Provider value={{ pageloading , setpageloading }}>
              {children}
            </Initialload.Provider>
          </Provider>
          <PrelineScript/>
        </body>
      </html>
    )
  }
  export default RootLayout
