import '../App.css';
import './Upload.css';
import notification from '../img/Notification.png'
import { Layout, Menu, Breadcrumb, Button, Row, Col, Input, InputNumber, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import firestore from '../firebase'
import ReactAudioPlayer from 'react-audio-player';

const { Header, Content, Footer } = Layout;

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function FinalizeInterviewData() {
  let query = useQuery();
  const todayDate = new Date()
  const todayString = `${todayDate.getMonth() + 1}/${todayDate.getDate()}/${todayDate.getFullYear()}`
  const key = query.get('key');
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayString)
  const [speakers, setSpeakers] = useState([])
  const [audioLink, setAudioLink] = useState(null)
  const [jsonLink, setJsonLink] = useState(null)
  const [speakersIntervals, setSpeakersIntervals] = useState([])

  useEffect(() => {
    const fillIntervals = async (jsonLink) => {
      const res = await fetch(jsonLink)
      const json_res = await res.text()
      JSON.parse(JSON.stringify(json_res))
      const output = json_res['output']
      
      let curr_speaker = output[0]['speaker_tag']
      let curr_start = output[0]['start_time']
      let curr_end = output[0]['end_time']
      let intervals = []
      for (let i = 0; i < speakers.length; i++) {
        intervals.push([-1,-1])
      }
      output.forEach(item => {
        let curr_interval = intervals[curr_speaker-1][1] - intervals[curr_speaker-1][0]
        if (item['speaker_tag'] !== curr_speaker) {
          if (curr_end - curr_start > curr_interval) {
            intervals[curr_speaker-1][1] = curr_end
            intervals[curr_speaker-1][0] = curr_start
          }
          curr_speaker = item['speaker_tag']
          curr_start = item['start_time']
          curr_end = item['end_time']
        } else {
          curr_end = item['end_time']
        }
      })
      let curr_interval = intervals[curr_speaker-1][1] - intervals[curr_speaker-1][0]
      if (curr_end - curr_start > curr_interval) {
        intervals[curr_speaker-1][1] = curr_end
        intervals[curr_speaker-1][0] = curr_start
      }
      setSpeakersIntervals(intervals)
    }

    const getData = async () => {
      let docRef = firestore.doc(`audioarchives/${key}`);
      let doc = await docRef.get();
      setTitle(doc.data().title || doc.data().filename)
      setDate(doc.data().date || date)
      setJsonLink(doc.data().jsonLink)
      setAudioLink(doc.data().audioLink)
      let speakersNumber = doc.data().speakersNumber
      let speakersList = []
      while (speakersList.length != speakersNumber) {
        speakersList.push((speakersList.length + 1).toString())
      }
      setSpeakers(speakersList)

      fillIntervals(doc.data().jsonLink)
    }
    getData()
  }, [])


  
  return (
    <Layout className="container">
      <Header className="header-container">
        <div className="header-content">
          <img src={notification} height={40} width={40}/>
        </div>
      </Header>
      <Content>
        <div className="content-container" style={{alignItems: 'flex-start'}}>
          <div className="title" id="upload-page-title">
            Finish processing {title}
          </div>
          <Row className="row">
            <Col span={6} className="label">Date of recording</Col>
            <Col span={2} />
            <Col span={6}>
                <input
                    placeholder={date}
                    value={date}
                    onChange={(text) => setDate(text.target.value)}
                    className="filename"
                />
            </Col>
          </Row>
          {speakers.map((item, index) => {
            return (
              <Row className="row" key={item}>
                <Col span={6} className="label">Who is this speaker?</Col>
                <Col span={2} />
                <Col span={6}>
                    <input
                        placeholder={item}
                        value={speakers[index]}
                        onChange={(text) => speakers[index] = text}
                        className="filename"
                    />
                </Col>
                <Col span={4}>
                  {
                    speakersIntervals[index] && (
                      <ReactAudioPlayer
                          style={{marginTop: 20}}
                          src={`${audioLink}#t=${speakersIntervals[index][0]},${speakersIntervals[index][1]}`}
                          controls
                      />
                    )
                  }
                  
                </Col>
              </Row>
            )})}
            
        </div>
      </Content>
    </Layout>
  );
}