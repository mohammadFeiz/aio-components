import { FC } from "react"
import { AI_Sidemenu_option, SideMenu } from "../aio-input"
import './index.css';

const AppContainer:FC = ()=>{
    return (
        <div className="app-container">

        </div>
    )
}
const AppSide:FC<{options:AI_Sidemenu_option[],onChange:(key:string)=>void}> = ({options,onChange})=>{
    return (
      <div className="app-side">
        <SideMenu
          options={options}
          onChange={onChange}
        />
      </div>
    )
  }