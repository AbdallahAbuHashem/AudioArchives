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
  const history = useHistory();
  let query = useQuery();
  const todayDate = new Date()
  const todayString = `${todayDate.getMonth() + 1}-${todayDate.getDate()}-${todayDate.getFullYear()}`
  const key = query.get('key');
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('Stanford, CA')
  const [date, setDate] = useState(todayString)
  const [speakers, setSpeakers] = useState([])
  const [audioLink, setAudioLink] = useState(null)
  const [jsonLink, setJsonLink] = useState(null)
  const [speakersIntervals, setSpeakersIntervals] = useState([])
  const [topics, setTopics] = useState('')
  const [length, setLength] = useState(0)
  const [json, setJson] = useState(null);

  let audio = null;

  useEffect(() => {
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
    }
    getData()
  }, [])

  useEffect(() => {
    if (audio) {
      setLength(audio.audioEl.current.duration)
    }
  }, [audio])

  useEffect(() => {
    const fillIntervals = async (jsonLink) => {
      const res = await fetch(jsonLink)
      const json_res = JSON.parse(await res.text())
      const output = json_res['output']
      setJson(json_res);
      
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
    fillIntervals(jsonLink)
  }, [speakers])

  const finishProcessing = async () => {
    let docRef = firestore.doc(`audioarchives/${key}`);
    let topicsList = topics.split(',')

    json['output'].forEach((word, idx) => {
      const speaker = speakers[parseInt(word['speaker_tag']) - 1]
      json['output'][idx]['speaker_tag'] = speaker
    })

    json['id'] = key
    json['title'] = title
    json['speakers'] = speakers
    json['location'] = location
    json['date'] = date
    json['length'] = length
    json['topics'] = topicsList
    
    let uri = await fetch(`/update_json?name=${title}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json)
    })

    const updated_json_link = await uri.text()

    let doc = await docRef.update({
      status: 'Finished',
      location,
      speakers,
      date,
      length,
      topics: topicsList,
      jsonLink: updated_json_link,
    });

    history.push(`/`)
  }
  
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
          <Row className="row">
            <Col span={6} className="label">Location</Col>
            <Col span={2} />
            <Col span={6}>
                <input
                    value={location}
                    onChange={(text) => setLocation(text.target.value)}
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
                        onChange={(text) => {
                          speakers[index] = text.target.value
                        }}
                        className="filename"
                    />
                </Col>
                <Col span={4}>
                  {
                    speakersIntervals[index] && (
                      <ReactAudioPlayer
                          ref={(element) => {
                            audio = element;
                          }}
                          src={`${audioLink}#t=${speakersIntervals[index][0]},${speakersIntervals[index][1]}`}
                          controls
                      />
                    )
                  }
                  
                </Col>
              </Row>
            )})}
            <Row className="row">
            <Col span={6} className="label">Topics (comma separated)</Col>
            <Col span={2} />
            <Col span={6}>
                <input
                    placeholder={"Topic 1, Topic 2"}
                    value={topics}
                    onChange={(text) => setTopics(text.target.value)}
                    className="filename"
                />
            </Col>
          </Row>
            <Row className="row">
            <Col span={6} className="label"></Col>
            <Col span={2} />
            <Col span={6}>
              <Button
                  type="primary"
                  onClick={finishProcessing}
                  className="button-text file-button"
              >
                  Finish
              </Button>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}