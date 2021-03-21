import React, { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Settings from './settings/Settings';
import './ViewPort.css';
import { Col, Container, Row } from 'react-bootstrap';

export default function ViewPort() {
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [templateUrl, setTemplateUrl] = useState("");
  const [templateSize, setTemplateSize] = useState({ width: 0, heigth: 0 });
  const [scaling, setScaling] = useState(1);
  const [imagePosition, setImagePosition] = useState(50);
  const [listOfTemplates, setListOfTemplates] = useState([]);
  const [windowHeight, setWindowHeight] = useState([]);

  const template = useRef(null);
  const viewPort = useRef(null);


  function calculateScaling() {
    const heigth = viewPort.current.offsetHeight;
    const width = viewPort.current.offsetWidth;

    // console.log(heigth);
    // console.log(templateSize.heigth);

    var heightScaling = 1;
    var widthScaling = 1;
    var offset = 0.05;

    if (templateSize.heigth > heigth) {
      heightScaling = heigth / templateSize.heigth;
    }

    if (templateSize.width > width) {
      widthScaling = width / templateSize.width;
    }

    if (heightScaling < widthScaling) {
      setScaling(heightScaling - offset);
    } else {
      setScaling(widthScaling - offset);
    }

    setWindowHeight(window.innerHeight * 0.9);
  }

  function initializeTemplates() {
    var files = [];
    var context = require.context("../templates", false, /\.(png|jpe?g|svg)$/);
    context.keys().forEach((fileName) => {
      var pureName = fileName.split(".")[1].replace("/", " ");

      files.push({
        fileName: pureName,
        url: context(fileName)
      })
    });

    console.log(files);

    setListOfTemplates(files);
    setTemplateUrl(files[0].url);
  }

  function calibrateTemplateSize() {
    var img = new Image();
    img.addEventListener("load", function(){
        setTemplateSize({ width: this.naturalWidth, heigth: this.naturalHeight });
    });
    img.src = templateUrl;
  }

  function onPageLoad() {
    calibrateTemplateSize();

    initializeTemplates();
  }

  useEffect(() => {
    console.log("TEMPLATE EFFECT")

    calibrateTemplateSize();
  }, [templateUrl])

  useEffect(() => {
    onPageLoad();
  }, [profileImageUrl])

  useEffect(() => {
    console.log("TEMPLATE SIZE")
    calculateScaling();

    window.addEventListener("resize", calculateScaling);

    return function cleanup() {
      window.removeEventListener("resize", calculateScaling);
    }
    
  }, [templateSize])

  useEffect(() => {
    console.log("ONCE")

    window.addEventListener('load', onPageLoad);
    

    return function cleanup() {
      window.removeEventListener("resize", calculateScaling);
      window.removeEventListener("load", onPageLoad);
    }
  }, [])

  useEffect(() => {
    calculateScaling();
  });

  return <Container style={{
    overflow: "hidden"
  }} fluid>
    <Row>
      <Col xs={14} md={3} >
        <div className="settings">
          <Settings calculateScaling={calculateScaling} setTemplateUrl={setTemplateUrl} listOfTemplates={listOfTemplates} setProfileImageUrl={setProfileImageUrl} setImagePosition={setImagePosition}></Settings>
        </div>
      </Col>
      <Col xs={14} md={9} >
        <div ref={viewPort} className="view-port" style={{ maxHeight: `${windowHeight}px` }}>
          <div id="canvas" className="canvas" style={{ transform: `scale(${scaling})` }}>
            <div id="stack" className="stack">
              <div className="profile-image">
                {profileImageUrl != "" ? <img src={profileImageUrl} style={{ objectPosition: `${imagePosition}% ${imagePosition}%` }} /> : <div></div>}
              </div>
              <div className="template-image">
                <img ref={template} id="template" src={templateUrl} />
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </Container>
}