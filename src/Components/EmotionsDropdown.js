import logo from "../logo.svg";
import "../App.css";
import { Alert, Button } from "antd";
import {Typography} from "antd";
import React, { useState } from "react";
import chevronUp from '../img/chevron_up.png';
import chevronDown from '../img/chevron_down.png';

const { Text } = Typography;

export default function EmotionsDropdown() {

  const [isOpen, setIsOpen] = useState(false);
  const [sad, setSad] = useState(false);
  const [happy, setHappy] = useState(false);
  const [angry, setAngry] = useState(true);

  return (
    <div className="filter">
‍
      <button
        //ref={buttonRef}
        onClick={() =>
          setIsOpen(!isOpen)}
        className="filter__button"
      >
         Emotions
        {isOpen ? <img src={chevronUp} style={{marginLeft:20, marginBottom:2,height:12}}/> : <img src={chevronDown} style={{marginLeft:20, marginBottom:2,height:12}}/>}
      </button>
      {isOpen && <div>
          <div style={{paddingtop:"2rem",paddingbottom:"2rem", alignItems:"center", backgroundColor:"white"}}>
            <form style={{paddingLeft:10,paddingTop:5, paddingBottom:5}}>
              <label>
                <input
                  type="checkbox"
                  name="Sad"
                  style={{marginRight:5}}
                  checked={sad}
                  onChange={() => setSad(!sad)}/>
                <text style={{backgroundColor:"rgba(55, 132, 187, .3)"}}>
                  Sad
                </text>
              </label>
              <label style={{display:"block"}}>
                <input
                  type="checkbox"
                  name="Happy"
                  style={{marginRight:5}}
                  checked={happy}
                  onChange={() => setHappy(!happy)}/>
                <text style={{backgroundColor:"rgba(255, 136, 108, .3)"}}>
                  Happy
                </text>
              </label>
              <label style={{display:"block"}}>
                <input
                  type="checkbox"
                  name="Angry"
                  style={{marginRight:5}}
                  checked={angry}
                  onChange={() => setAngry(!angry)}/>
                  <text style={{backgroundColor:"rgba(224, 53, 53, .3)"}}>
                    Angry
                  </text>
              </label>
            </form>
          </div>
        </div>
      }
    </div>
  );
}
