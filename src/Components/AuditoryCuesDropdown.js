import logo from "../logo.svg";
import "../App.css";
import { Alert, Button } from "antd";
import {Typography} from "antd";
import React, { useState, useRef, createRef, useEffect } from "react";
import chevronUp from '../img/chevron_up.png';
import chevronDown from '../img/chevron_down.png';
import cryEmoji from '../img/cry_emoji.png';
import laughEmoji from '../img/laugh_emoji.png';
import pauseEmoji from '../img/pause_emoji.png';
import yawnEmoji from '../img/yawn_emoji.png';

const { Text } = Typography;

export default function AuditoryCuesDropdown() {

  const [isOpen, setIsOpen] = useState(true);
  const [pauses, laughter, crying, yawns] = useState(false);
  // const dropdownRef = useRef(undefined);
  // const buttonRef = createRef();

  const onChange = (e) => {
    console.log(e.target.name)
  }

  // useEffect(() => {
  //   const handleClickOutside = event => {
  //     const isDropdownClick = dropdownRef.current && dropdownRef.current.contains(event.target);
  //     const isButtonClick = buttonRef.current && buttonRef.current.contains(event.target);
  //     if (isButtonClick) {
  //       /* If the ref is not defined or the user clicked on the menu, we don’t do anything. */
  //       return;
  //     }
  //
  //     if (isDropdownClick) {
  //       return;
  //     }
  //
  //     /* Otherwise we close the menu. */
  //     setIsOpen(false);
  //   };

  //   document.addEventListener("mousedown", handleClickOutside); /* handle desktops */
  //   /* Event cleanup */
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside); /* handle desktops */
  //   };
  // }, [dropdownRef, buttonRef]);

  return (
    <div classname="filter">
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
                  defaultChecked={pauses}
                  onChange={onChange}/>
                Pauses
                <img src={pauseEmoji} style={{marginLeft:4, height:16}}/>
              </label>
              <label style={{display:"block"}}>
                <input
                  type="checkbox"
                  name="Laughter"
                  style={{marginRight:5}}
                  defaultChecked={laughter}
                  onChange={onChange}/>
                  Laughter
                  <img src={laughEmoji} style={{marginLeft:4, height:16}}/>
              </label>
              <label style={{display:"block"}}>
                <input
                  type="checkbox"
                  name="Crying"
                  style={{marginRight:5}}
                  defaultChecked={crying}
                  onChange={onChange}/>
                  Crying
                  <img src={cryEmoji} style={{marginLeft:4, height:16}}/>
              </label>
              <label style={{display:"block"}}>
                <input
                  type="checkbox"
                  defaultChecked={yawns}
                  style={{marginRight:5}}
                  onChange={onChange}/>
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
