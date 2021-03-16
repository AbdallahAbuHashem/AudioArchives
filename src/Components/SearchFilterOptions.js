import logo from "../logo.svg";
import "../App.css";
import { Alert, Button } from "antd";
import {Typography} from "antd";
import React, { useState } from "react";
import blackChevronUp from '../img/blackChevronUp.png';
import blackChevronDown from '../img/blackChevronDown.png';

const { Text } = Typography;

export default function SearchFilterOptions() {

  const [isOpen, setIsOpen] = useState(true);
  const [addingSpeakers, setAddingSpeakers] = useState(false);
  const [speakers, setSpeakers] = useState(false);
  const [addingDates, setAddingDates] = useState(false);
  const [dates, setDates] = useState(false);
  const [addingLocations, setAddingLocations] = useState(false);
  const [locations, setLocations] = useState(true);

  const AddingTextInput = () => {
    <div style={{display:"flex"}}>
      <input type="text" style={{margin:10}}/>
      <button style={{marginTop:10, marginLeft:10, marginRight:5, height:30, width:80}}
        onClick={() => {alert("add a location"); setAddingLocations(false);}}
        >
        Add
      </button>
      <button style={{marginTop:10, marginLeft:0, height:30, width:80}}
        onClick={() => {alert("cancel"); setAddingLocations(false);}}
        >
        Cancel
      </button>
    </div>
  }

  return (
    <div style={{flex:1, flexDirection:"column", justifyContent:"center", alignItems:"center", width:"100%"}}>
‍     <div style={{flex:1, flexDirection:"row", justifyContent:"center", width:"100%"}}>
      <button
        onClick={() =>
          setIsOpen(!isOpen)}
        style={{border:"none", backgroundColor:"var(--beige)", alignItems:"center"}}
      >
          <Text style={{ fontSize:30 }}>
            Filters
          </Text>
          {isOpen ? <img src={blackChevronUp} style={{marginLeft:20,marginBottom:10,height:30}}/> : <img src={blackChevronDown} style={{marginLeft:20,marginBottom:10,height:30}}/>}
      </button>
      </div>
      {isOpen && <div>
          <div style={{paddingtop:"2rem",paddingbottom:"2rem",border:"none", backgroundColor:"var(--beige)", alignItems:"center"}}>
            <div style={{paddingLeft:10,paddingTop:5, paddingBottom:5, dispaly:"flex", width:"80%"}}>
              <div style={{display:"block", padding:15}}>
                <div style={{flexDirection:"row", flex:1, display:"flex",justifyContent:"space-between"}}>
                  <Text style={{margin:10, fontSize:20, display:"flex", flex:2}}>
                    Speakers
                  </Text>
                {addingSpeakers ?
                  <AddingTextInput/>
                  :
                  <button style={{border:"none", backgroundColor:"var(--beige)", justifyContent:"center"}}
                    onClick={() => {setAddingSpeakers(false);}}
                    >
                    <Text style={{fontSize:20, color:"#FF886C"}}>
                      Add
                    </Text>
                  </button>
                }
                </div>
              </div>
              <div style={{display:"block", padding:15}}>
                <div style={{flexDirection:"row", flex:1, display:"flex",justifyContent:"space-between"}}>
                  <Text style={{margin:10, fontSize:20, display:"flex", flex:2}}>
                    Dates
                  </Text>
                  {addingDates ?
                    <AddingTextInput/>
                    :
                    <button style={{border:"none", backgroundColor:"var(--beige)", justifyContent:"center"}}
                      onClick={() => {setAddingDates(false);}}
                      >
                      <Text style={{fontSize:20, color:"#FF886C"}}>
                        Add
                      </Text>
                    </button>
                  }
                </div>
              </div>
              <div style={{display:"block", padding:15}}>
                <div style={{flexDirection:"row", flex:1, display:"flex",justifyContent:"space-between"}}>
                  <Text style={{margin:10, fontSize:20, display:"flex", flex:2}}>
                    Locations
                  </Text>
                  {addingLocations ?
                    <AddingTextInput/>
                    :
                    <button style={{border:"none", backgroundColor:"var(--beige)", justifyContent:"center"}}
                      onClick={() => {setAddingLocations(false);}}
                      >
                      <Text style={{fontSize:20, color:"#FF886C"}}>
                        Add
                      </Text>
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
