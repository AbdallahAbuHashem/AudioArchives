import '../App.css';
import './Upload.css';
import notification from '../img/Notification.png'
import { Layout, Menu, Breadcrumb, Button, Row, Col, Input, InputNumber, Radio } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import firestore from '../firebase'

const { Header, Content, Footer } = Layout;
export default function Upload() {
  const history = useHistory();
  const [title, setTitle] = useState('')
  const [selectedFilename, setSelectedFilename] = useState('')
  const [speakersNumber, setSpeakersNumber] = useState(1)
  const [format, setFormat] = useState('wav')
  const [fileBody, setFileBody] = useState(null)
  let upload = null;
  let type = null;
  
  const onChangeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    let reader = new FileReader();
    setSelectedFilename(file.name);
    setTitle(file.name);
    type = file.type
    reader.readAsDataURL(file)
    reader.onload = async () => {
      setFileBody(reader.result);

      // const upload_result = await fetch(`/upload?name=${filename}&type=${file.type}&speakers=${speakersNumber}&ext=${format}`, {
        // method: 'POST',
        // headers: {
          // 'Accept': 'application/json',
          // 'Content-Type': 'application/json',
        // },
        // body: reader.result
      // })
      // console.log(upload_result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
  }

  const onChange = (e) => {
    setFormat(e.target.value);
  }

  const beginProcessing = async () => {
    const audioRef = firestore.collection('audioarchives').doc();
    const res = await audioRef.set({
      title,
      speakersNumber,
      format,
      status: 'Processing',
      audioLink: '',
      jsonLink: '',
      peopleList: [],
      date: '',
    })
    fetch(`/upload?name=${title}&type=${type}&speakers=${speakersNumber}&ext=${format}&key=${audioRef.id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: fileBody
    })
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
          <input id="myInput"
            type="file"
            ref={(ref) => upload = ref}
            style={{display: 'none'}}
            onChange={onChangeFile}
          />
          <div className="title" id="upload-page-title">
            Upload file to archives
          </div>
          <Row className="row">
            <Col span={6} className="label">Select file</Col>
            <Col span={2} />
            <Col span={6}>
                <Button
                    type="primary"
                    onClick={()=>{upload.click()}}
                    className="button-text file-button"
                >
                    {selectedFilename === '' ? "Upload" : selectedFilename}
                </Button>
            </Col>
          </Row>
          <Row className="row">
            <Col span={6} className="label">Title</Col>
            <Col span={2} />
            <Col span={6}>
                <input
                    placeholder="Name for uploaded file"
                    value={title}
                    onChange={(text) => setTitle(text.target.value)}
                    className="filename"
                />
            </Col>
          </Row>
          <Row className="row">
            <Col span={6} className="label">Format</Col>
            <Col span={2} />
            <Col span={8}>
            <Radio.Group onChange={onChange} defaultValue="wav" style={{display: 'flex'}}>
              <Radio.Button value="wav" className={format === "wav" ? "button-text radio-button radio-button-selected radio-button-left" : "button-text radio-button radio-button-unselected radio-button-left"}>WAV</Radio.Button>
              <Radio.Button value="flac" className={format === "flac" ? "button-text radio-button radio-button-selected radio-button-center" : "button-text radio-button radio-button-unselected radio-button-center"}>FLAC</Radio.Button>
              <Radio.Button value="mp3" className={format === "mp3" ? "button-text radio-button radio-button-selected radio-button-right" : "button-text radio-button radio-button-unselected radio-button-right"}>MP3</Radio.Button>
            </Radio.Group>
            </Col>
          </Row>
          <Row className="row">
            <Col span={6} className="label">Number of speakers</Col>
            <Col span={2} />
            <Col span={6}>
                <InputNumber
                    placeholder="Name for uploaded file"
                    value={speakersNumber}
                    onChange={(val) => setSpeakersNumber(val)}
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
                    onClick={beginProcessing}
                    className="button-text file-button"
                >
                    Begin Processing
                </Button>
            </Col>
          </Row>
          
        </div>
      </Content>
    </Layout>
  );
}