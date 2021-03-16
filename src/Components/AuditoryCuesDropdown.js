import logo from "../logo.svg";
import "../App.css";
import { Button } from "antd";
import {Typography} from "antd";
import React, { useState } from "react";
import chevronUp from '../img/chevron_up.png';
import chevronDown from '../img/chevron_down.png';
import cryEmoji from '../img/cry_emoji.png';
import laughEmoji from '../img/laugh_emoji.png';
import pauseEmoji from '../img/pause_emoji.png';
import yawnEmoji from '../img/yawn_emoji.png';

const { Text } = Typography;

export default function AuditoryCuesDropdown() {

  const [isOpen, setIsOpen] = useState(false);
  const [pauses, setPauses] = useState(false);
  const [laughter, setLaughter] = useState(false);
  const [crying, setCrying] = useState(false);
  const [yawns, setYawns] = useState(false);

  const onChange = (e) => {
    console.log(e.target.name)
  }

  return (
    <div className="filter">
‍
      <button
        //ref={buttonRef}
        onClick={() =>
          setIsOpen(!isOpen)}
        className="filter__button"
      >
        Auditory Cues
        {isOpen ? <img src={chevronUp} style={{marginLeft:20, marginBottom:2,height:12}}/> : <img src={chevronDown} style={{marginLeft:20, marginBottom:2,height:12}}/>}
      </button>
      {isOpen && <div>
          <div style={{paddingtop:"2rem",paddingbottom:"2rem", alignItems:"center", backgroundColor:"white"}}>
            <form style={{paddingLeft:10,paddingTop:5, paddingBottom:5}}>
              <label>
                <input
                  type="checkbox"
                  name="Pauses"
                  style={{marginRight:5}}
                  checked={pauses}
                  onChange={() => setPauses(!pauses)}/>
                Pauses
                <img src={pauseEmoji} style={{marginLeft:4, height:16}}/>
              </label>
              <label style={{display:"block"}}>
                <input
                  type="checkbox"
                  name="Laughter"
                  style={{marginRight:5}}
                  checked={laughter}
                  onChange={() => setLaughter(!laughter)}/>
                  Laughter
                  <img src={laughEmoji} style={{marginLeft:4, height:16}}/>
              </label>
              <label style={{display:"block"}}>
                <input
                  type="checkbox"
                  name="Crying"
                  style={{marginRight:5}}
                  checked={crying}
                  onChange={() => setCrying(!crying)}/>
                  Crying
                  <img src={cryEmoji} style={{marginLeft:4, height:16}}/>
              </label>
              <label style={{display:"block"}}>
                <input
                  type="checkbox"
                  checked={yawns}
                  style={{marginRight:5}}
                  onChange={() => setYawns(!yawns)}/>
                  Yawns
                  <img src={yawnEmoji} style={{marginLeft:4, height:16}}/>
              </label>
            </form>
          </div>
        </div>
      }
    </div>
  );
}
