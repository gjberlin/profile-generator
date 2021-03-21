import React, { Component } from 'react';
import { Accordion, Button, ButtonGroup, Card, Form } from 'react-bootstrap';
import domtoimage from 'dom-to-image';

export default function Settings({ setImagePosition, setProfileImageUrl, listOfTemplates, setTemplateUrl, calculateScaling }) {
  return <div>
    <Accordion defaultActiveKey="0">
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            Profile Picture Generator
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Form>
              <Form.Group>
                <ButtonGroup aria-label="Basic example">
                  {listOfTemplates.map(template => (
                    <Button variant="secondary" onClick={() => {
                      setTemplateUrl(template.url);
                    }}>{template.fileName}</Button>
                  ))}
                </ButtonGroup>
              </Form.Group>
              <Form.Group>
                <Form.File id="custom-file" label="Select File" custom onChange={(e) => {
                  var file = e.target.files[0]

                  var fr = new FileReader();
                  fr.onload = (event) => {
                    var url = event.target.result;
                    setProfileImageUrl(url);
                  }

                  fr.readAsDataURL(file);
                }}></Form.File>
              </Form.Group>

              <Form.Group controlId="formBasicRangeCustom">
                <Form.Label>Image Position</Form.Label>
                <Form.Control onChange={(e) => { setImagePosition(e.target.value) }} type="range" custom />
              </Form.Group>

              <Form.Group>
                <Button onClick={() => {
                  domtoimage.toJpeg(document.getElementById('stack'), { quality: 0.95 })
                    .then(function (dataUrl) {
                      var link = document.createElement('a');
                      link.download = 'my-image-name.jpeg';
                      link.href = dataUrl;
                      link.click();
                    });
                }}>Save Image</Button>
              </Form.Group>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  </div>;
}