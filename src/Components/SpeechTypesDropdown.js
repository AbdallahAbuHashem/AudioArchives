import logo from "../logo.svg";
import "../App.css";
import { Alert, Button } from "antd";
import {Typography} from "antd";
import React, { useState, useRef, createRef, useEffect } from "react";
import chevronUp from '../img/chevron_up.png';
import chevronDown from '../img/chevron_down.png';

const { Text } = Typography;

export default function SpeechTypesDropdown() {

  const [isOpen, setIsOpen] = useState(true);
  const [whispering, shouting] = useState(false);

  const onChange = (e) => {
    console.log(e.target.name)
  }

  return (
    <div classname="filter">
‍
      <button
        onClick={() =>
          setIsOpen(!isOpen)}
        className="filter__button"
      >
         Speech Types
        {isOpen ? <img src={chevronUp} style={{marginLeft:20, marginBottom:2,height:12}}/> : <img src={chevronDown} style={{marginLeft:20, marginBottom:2,height:12}}/>}
      </button>
      {isOpen && <div>
          <div style={{paddingtop:"2rem",paddingbottom:"2rem", alignItems:"center", backgroundColor:"white"}}>
            <form style={{paddingLeft:10,paddingTop:5, paddingBottom:5}}>
              <label>
                <input
                  type="checkbox"
                  name="Whispering"
                  style={{marginRight:5}}
                  defaultChecked={whispering}
                  onChange={onChange}/>
                <text style={{fontStyle:"italic"}}>
                  Whispering
                </text>
              </label>
              <label style={{display:"block"}}>
                <input
                  type="checkbox"
                  name="Shouting"
                  style={{marginRight:5}}
                  defaultChecked={shouting}
                  onChange={onChange}/>
                <text style={{fontWeight:"bold"}}>
                  Shouting
                </text>
              </label>
            </form>
          </div>
        </div>
      }
    </div>
  );
}
