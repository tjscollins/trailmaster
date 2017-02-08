/*----------Modules----------*/
import React from 'react';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

export class FAQ extends BaseComponent {
  render() {
    return (
      <div id='faq-modal' className='modal fade'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                <span aria-hidden='true'>&times;</span>
              </button>
              <h4 className='modal-title'>Frequently Asked Questions</h4>
            </div>
            <div className='modal-body'>
              <ol>
                <li>
                  <h5>What is Trailmaster?</h5>
                  <p>Trailmaster is a publicly accessible, open-source web application for storing, sharing, and using GPS data from wearable athletic devices to plan new trail running and mountain biking courses.</p>
                </li>
                <li>
                  <h5>How Do I Use TrailMaster?</h5>
                  <p>The website is meant to be simple to use. <a target='_blank' href='https://www.youtube.com/watch?v=spYawo61iIc'>This Youtube video</a> explains how to use the site to plan new running and biking courses.</p>
                </li>
                <li>
                  <h5>How Can I Use the Site While Marking or Running a Course?</h5>
                  <p>Trailmaster can be accessed from any Android or iOS device the same as you access it from your computer.  <a target='_blank' href='http://www.howtogeek.com/196087/how-to-add-websites-to-the-home-screen-on-any-smartphone-or-tablet/'>This page</a> explains how to save Trailmaster to your mobile device's homescreen </p>
                </li>
                <li>
                  <h5>Is There an App Store Version?</h5>
                  <p>Not yet, but an Android version is in development.  Once finished it will have several new capabilities that the website does not have.</p>
                </li>
                <li>
                  <h5>How Do I Contribute to the Database?</h5>
                  <p>Contributing to the database of running and biking routes is simple once you know how to get a GPX file from your GPS-capable device.  See <a target='_blank' href='https://youtu.be/2LyszJVVjLk'>this video</a> for instructions on how to upload data.</p>
                </li>
                <li>
                  <h5>Why Don't I See Any POIs or Routes?</h5>
                  <p>Trailmaster is currently set to only display data within 50 miles of the center of your current map view.  If you don't see any data, then no one in that area has shared any data yet.  Be the first!</p>
                </li>
                <li>
                  <h5>I Found a Bug!</h5>
                  <p>Send me an email at <a target='_blank' href='mailto:tjscollins@gmail.com'>tjscollins@gmail.com</a> describing what you were doing and what happened.</p>
                </li>
              </ol>
            </div>
            <div className='modal-footer'>
              <button type='submit' className='btn btn-default' data-dismiss='modal'>Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FAQ;
