import '../App.css';
import { Button, Row, Col, Input, InputNumber } from 'antd';
import React, { useState } from 'react';


export default function Upload() {
  const [filename, setFilename] = useState('')
  const [speakersNumber, setSpeakersNumber] = useState(1)
  let upload = null;
  
  const onChangeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    let reader = new FileReader();
    setFilename(file.name);
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const example_name = "test.mp3"
      const upload_result = await fetch(`/upload?name=${example_name}&type=${file.type}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: reader.result
      })
      console.log(upload_result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
  }

  return (
    <div className="container">
      <input id="myInput"
        type="file"
        ref={(ref) => upload = ref}
        style={{display: 'none'}}
        onChange={onChangeFile}
      />
      <Row style={{width: '100%'}}>
        <Col span={6}>Select file</Col>
        <Col>
            <Button
                type="primary"
                onClick={()=>{upload.click()}}
            >
                upload
            </Button>
        </Col>
      </Row>

      <Row style={{width: '100%'}}>
        <Col span={6}>Filename</Col>
        <Col>
            <Input
                placeholder="Name for uploaded file"
                value={filename}
                onChange={(text) => setFilename(text)}
            />
        </Col>
      </Row>

      <Row style={{width: '100%'}}>
        <Col span={6}>Number of speakers</Col>
        <Col>
            <InputNumber
                placeholder="Name for uploaded file"
                value={speakersNumber}
                onChange={(val) => setSpeakersNumber(val)}
            />
        </Col>
      </Row>
    </div>
  );
}