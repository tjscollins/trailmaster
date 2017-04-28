/*----------Modules----------*/
import React from 'react';
import Markdown from 'markdown-to-jsx';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

let faqText = require('../../html/faq.md');

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
              <Markdown>
                {faqText}
              </Markdown>
            </div>
            <div className='modal-footer'>
              <button id='faq-modal-close' type='submit' className='btn btn-default' data-dismiss='modal'>Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FAQ;
