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
                  <p>The website is designed to be simple to use.</p>
                </li>
                <li>
                  <h5>How Do I Contribute to the Database?</h5>
                  <p></p>
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
