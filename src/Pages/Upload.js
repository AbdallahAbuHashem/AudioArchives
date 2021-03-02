import '../App.css';
import { Layout, Menu, Breadcrumb, Button, Row, Col, Input, InputNumber, Radio } from 'antd';
import React, { useState } from 'react';

const { Header, Content, Footer } = Layout;
export default function Upload() {
  const [filename, setFilename] = useState('')
  const [speakersNumber, setSpeakersNumber] = useState(1)
  const [format, setFormat] = useState('wav')
  let upload = null;
  
  const onChangeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    let reader = new FileReader();
    setFilename(file.name);
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const upload_result = await fetch(`/upload?name=${filename}&type=${file.type}&speakers=${speakersNumber}&ext=${format}`, {
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

  const onChange = (e) => {
    setFormat(e.target.value);
  }

  return (
    <Layout className="layout">
            <Header />
            <Content style={{ padding: '0 50px', flex: 1, marginTop: 50 }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Upload</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <input id="myInput"
                    type="file"
                    ref={(ref) => upload = ref}
                    style={{display: 'none'}}
                    onChange={onChangeFile}
                  />
                  <Row style={{width: '100%', marginBottom: 16}}>
                    <Col span={6}>Filename</Col>
                    <Col span={6}>
                        <Input
                            placeholder="Name for uploaded file"
                            value={filename}
                            onChange={(text) => setFilename(text.target.value)}
                        />
                    </Col>
                  </Row>

                  <Row style={{width: '100%', marginBottom: 16}}>
                    <Col span={6}>Number of speakers</Col>
                    <Col span={6}>
                        <InputNumber
                            placeholder="Name for uploaded file"
                            value={speakersNumber}
                            onChange={(val) => setSpeakersNumber(val)}
                        />
                    </Col>
                  </Row>

                  <Row style={{width: '100%', marginBottom: 16}}>
                    <Col span={6}>Format</Col>
                    <Col span={6}>
                    <Radio.Group onChange={onChange} defaultValue="wav">
                      <Radio.Button value="wav">WAV</Radio.Button>
                      <Radio.Button value="flac">FLAC</Radio.Button>
                      <Radio.Button value="mp3">MP3</Radio.Button>
                    </Radio.Group>
                    </Col>
                  </Row>

                  <Row style={{width: '100%', marginBottom: 16}}>
                    <Col span={6}>Select file</Col>
                    <Col span={6}>
                        <Button
                            type="primary"
                            onClick={()=>{upload.click()}}
                        >
                            upload
                        </Button>
                    </Col>
                  </Row>
                </div>
            </Content>
        </Layout>
  );
}