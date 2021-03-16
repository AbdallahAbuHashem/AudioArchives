import logo from "../logo.svg";
import "../App.css";
import { Alert, Button } from "antd";
import { AutoComplete } from "antd";
import { Layout, Menu, Breadcrumb, Typography } from "antd";
import React, { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import AuditoryCuesDropdown from "../Components/AuditoryCuesDropdown"
import EmotionsDropdown from "../Components/EmotionsDropdown"
import SpeechTypesDropdown from "../Components/SpeechTypesDropdown"
import firestore from '../firebase'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useHistory,
  useLocation,
} from "react-router-dom";
import { words } from "../example_data";
import { Table, Tag, Space } from "antd";

const { Text } = Typography;
const TEST_KEY = 'LOMigP5J6tP0XbgeMX6f'

const { Header, Content, Footer } = Layout;
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function InterviewSearchPreview() {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [transcriptObj, setTranscriptObj] = useState(null)
  const [audioLink, setAudioLink] = useState(null)
  const [jsonLink, setJsonLink] = useState(null)
  const [speakers, setSpeakers] = useState(null)
  const [topics, setTopics] = useState(null)
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [currTime, setCurrTime] = useState(0)
  let query = useQuery();
  // const key = query.get("key");
  const key = TEST_KEY;
  let speaker = 1;
  let audio = null;

  useEffect(() => {
    const getRecordingData = async () => {
      let docRef = firestore.doc(`audioarchives/${key}`);
      let doc = await docRef.get();
      setTitle(doc.data().title || doc.data().filename)
      setDate(doc.data().date)
      setJsonLink(doc.data().jsonLink)
      setAudioLink(doc.data().audioLink)
      setSpeakers(doc.data().speakers)
      setLocation(doc.data().location)
      setTopics(doc.data().topics)
    }
    getRecordingData()
  }, [])

  useEffect(() => {
    const getJSON = async () => {
      if (jsonLink) {
        const res = await fetch(jsonLink)
        const json_res = JSON.parse(await res.text())
        setTranscriptObj(json_res);
      }
    }
    getJSON()
  }, [jsonLink])

  const updateHighlight = (e) => {
    console.log(e)
    setCurrTime(e)
  }

  const generateText = () => {
    let toRenderList = []
    let currObj = {
      speaker: '',
      timestamp: '00:00',
      words: []
    }
    if (transcriptObj) {
      currObj['speaker'] = transcriptObj['output'][0]['speaker_tag']
      let minutes = (parseInt(transcriptObj['output'][0]['start_time'] / 60)).toString().padStart(2,'0')
      let seconds = (parseInt(transcriptObj['output'][0]['start_time'] % 60)).toString().padStart(2,'0')
      currObj['timestamp'] = `${minutes}:${seconds}`
      transcriptObj['output'].forEach(wordObj => {
        if (currObj['speaker'] !== wordObj.speaker_tag) {
          toRenderList.push({...currObj})
          let minutes = (parseInt(wordObj['start_time'] / 60)).toString().padStart(2,'0')
          let seconds = (parseInt(wordObj['start_time'] % 60)).toString().padStart(2,'0')
          currObj = {
            speaker: wordObj.speaker_tag,
            timestamp: `${minutes}:${seconds}`,
            words: [wordObj],
          }
        } else {
          currObj['words'].push(wordObj)
        }
      });
      toRenderList.push({...currObj})
    }
    return (
      <>
      {toRenderList.map((utterance) => {
        console.log(utterance)
        let wordsComp = utterance['words'].map((wordObj) => {
          let val = (
            <Text
              className="clickable-text"
              onClick={() =>
                (audio.audioEl.current.currentTime =
                  wordObj.start_time - 1 > 0 ? wordObj.start_time - 1 : 0)
              }
            >
              {wordObj.word}{" "}
            </Text>
          )
          if (wordObj.start_time > currTime-1 && wordObj.end_time < currTime + 1) {
            val = (
              <mark className="mark-transcript">{val}</mark>
            )
          }
          return val;
        })

        let utteranceComp = (
          <div style={{display: 'flex'}}>
            <div style={{marginRight: 16}}>
              <Text className="timestamp-transcript">{utterance.timestamp}</Text>
            </div>
            <div>
              <Text
                className="clickable-text"
                style={{fontWeight: 'bold'}}
              >
                {utterance.speaker}:{" "}
              </Text>
              {wordsComp}
              <br />
            </div>
          </div>
        )
        
        return utteranceComp
      })}
      </>
    )
  }

  return (
    <Layout className="container">
      <Header className="header-container">
        
      </Header>
      <Content style={{display: 'contents'}}>
        <div className="content-container">
          
          <div id="interview-page-title">
            <div className="title" id="main-page-title" style={{textAlign: 'left', flex: 2}}>
              {title}
            </div>
            <div className="dropdowns-container">
              <AuditoryCuesDropdown/>
              <SpeechTypesDropdown/>
              <EmotionsDropdown/>
            </div>
          </div>
          
          <div className="interview-transcript">
            {generateText()}
          </div>
          <ReactAudioPlayer
            style={{marginBottom: 24, marginTop: 24}}
            listenInterval={1000}
            onListen={(e) => updateHighlight(e)}
            onSeeked={(e) => updateHighlight(e)}
            ref={(element) => {
              audio = element;
            }}
            src={audioLink}
            controls
          />

        </div>
      </Content>
    </Layout>
  );

  // return (
    // <Layout className="layout">
    //   <Header>
    //     <Search initValue={term} initContext={context} />
    //   </Header>
    //   <Content style={{ padding: "0 50px", flex: 1, marginTop: 50 }}>
    //     <Breadcrumb style={{ margin: "16px 0" }}>
    //       <Breadcrumb.Item>Search</Breadcrumb.Item>
    //       <Breadcrumb.Item>Search Results</Breadcrumb.Item>
    //       <Breadcrumb.Item>CNN Obama 2012 Interview</Breadcrumb.Item>
    //     </Breadcrumb>
    //     <div
    //       style={{
    //         display: "flex",
    //         flexDirection: "row",
    //         padding: "24px",
    //       }}
    //     >
    //       <div
    //         style={{
    //           display: "flex",
    //           flexDirection: "column",
    //           padding: "24px",
    //         }}
    //       >
    //         <Text style={{ fontSize: 30, fontWeight: 600 }}>
    //           Michael Lin Interview
    //         </Text>
    //         <Text>Speakers: Michael Lin, Claire Rosenfeld</Text>
    //         <Text>Location: Stanford, CA</Text>
    //         <Text>Date: March 2 2020</Text>
    //         <Text>Length: 52 minutes</Text>
    //         <Text>Topics: COVID, Stanford University</Text>
    //       </div>
    //       <div
    //         style={{
    //           display: "flex",
    //           flexDirection: "column",
    //           padding: "24px",
    //         }}
    //       >
    //         <AuditoryCuesDropdown/>
    //       </div>
    //       <div
    //         style={{
    //           display: "flex",
    //           flexDirection: "column",
    //           padding: "24px",
    //         }}
    //       >
    //         <SpeechTypesDropdown/>
    //       </div>
    //       <div
    //         style={{
    //           display: "flex",
    //           flexDirection: "column",
    //           padding: "24px",
    //         }}
    //       >
    //         <EmotionsDropdown/>
    //       </div>
    //     </div>
    //     <div
    //       className="site-layout-content"
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //       }}
    //     >
    //       <div style={{ height: 200, overflow: "scroll" }}>
    //         <Text
    //           className="clickable-text"
    //           onClick={() =>
    //             (audio.audioEl.current.currentTime = words[0].start_time)
    //           }
    //         >
    //           Speaker 1:{" "}
    //         </Text>
    //         {words.map((wordObj) => {
    //           let val = null;
    //           if (context === "people" && term === wordObj.speaker_tag) {
    //             val = (
    //               <Text
    //                 className="clickable-text"
    //                 mark
    //                 onClick={() =>
    //                   (audio.audioEl.current.currentTime =
    //                     wordObj.start_time - 1 > 0 ? wordObj.start_time - 1 : 0)
    //                 }
    //               >
    //                 {wordObj.word}{" "}
    //               </Text>
    //             );
    //           } else if (
    //             context === "text" &&
    //             term === wordObj.word.toLowerCase()
    //           ) {
    //             val = (
    //               <Text
    //                 className="clickable-text"
    //                 mark
    //                 onClick={() =>
    //                   (audio.audioEl.current.currentTime =
    //                     wordObj.start_time - 1 > 0 ? wordObj.start_time - 1 : 0)
    //                 }
    //               >
    //                 {wordObj.word}{" "}
    //               </Text>
    //             );
    //           } else if (
    //             context === "emotions" &&
    //             term === wordObj.emotion.toLowerCase()
    //           ) {
    //             val = (
    //               <Text
    //                 className="clickable-text"
    //                 mark
    //                 onClick={() =>
    //                   (audio.audioEl.current.currentTime =
    //                     wordObj.start_time - 1 > 0 ? wordObj.start_time - 1 : 0)
    //                 }
    //               >
    //                 {wordObj.word}{" "}
    //               </Text>
    //             );
    //           } else {
    //             val = (
    //               <Text
    //                 className="clickable-text"
    //                 onClick={() =>
    //                   (audio.audioEl.current.currentTime =
    //                     wordObj.start_time - 1 > 0 ? wordObj.start_time - 1 : 0)
    //                 }
    //               >
    //                 {wordObj.word}{" "}
    //               </Text>
    //             );
    //           }
    //           if (speaker !== wordObj.speaker_tag) {
    //             speaker = wordObj.speaker_tag;
    //             return (
    //               <>
    //                 <br />
    //                 <Text
    //                   className="clickable-text"
    //                   onClick={() =>
    //                     (audio.audioEl.current.currentTime =
    //                       wordObj.start_time - 1 > 0
    //                         ? wordObj.start_time - 1
    //                         : 0)
    //                   }
    //                 >
    //                   {" "}
    //                   Speaker {speaker}:{" "}
    //                 </Text>
    //                 {val}
    //               </>
    //             );
    //           } else {
    //             return val;
    //           }
    //         })}
    //       </div>
    //       <ReactAudioPlayer
    //         style={{ marginTop: 20 }}
    //         ref={(element) => {
    //           audio = element;
    //         }}
    //         src="https://storage.googleapis.com/audio-bucket-206/test_interview.mp3"
    //         controls
    //       />
    //     </div>
    //   </Content>
    // </Layout>
  // );
}

function Search({ initValue, initContext, setSearchContext, setSearchTerm }) {
  const history = useHistory();
  const handleClick = (str, context) =>
    history.push(`/search_results?term=${str}&context=${context}`);
  const [value, setValue] = useState(
    `Search for ${initValue} in ${initContext}`
  );
  const [options, setOptions] = useState([]);

  const mockVal = (str, list_option = 1) => {
    if (list_option === 1) {
      return {
        value: `Search for ${str} in People`,
      };
    } else if (list_option === 2) {
      return {
        value: `Search for ${str} in Emotions`,
      };
    } else {
      return {
        value: `Search for ${str} in Text`,
      };
    }
  };

  const onSearch = (searchText) => {
    setValue(searchText);
    setOptions(
      !searchText
        ? []
        : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]
    );
  };

  const onSelect = (data, option) => {
    if (data === `Search for ${value} in People`) {
      setSearchContext("people");
      setValue(`Search for ${value} in people`);
    } else if (data === `Search for ${value} in Emotions`) {
      setSearchContext("emotions");
      setValue(`Search for ${value} in emotions`);
    } else {
      setSearchContext("text");
      setValue(`Search for ${value} in text`);
    }
    setSearchTerm(value);
  };

  const onChange = (data) => {
    setValue(data);
  };

  return (
    <>
      <AutoComplete
        options={options}
        style={{
          width: "50%",
        }}
        onSelect={onSelect}
        onSearch={onSearch}
        value={value}
        placeholder="Search your archives"
      />
    </>
  );
}
