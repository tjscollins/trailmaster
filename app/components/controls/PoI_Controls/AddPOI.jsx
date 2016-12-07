/*----------Modules----------*/
import React from 'react';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

class AddPOI extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  render() {
    return (
      <div>
        <form ref="addPOI" onSubmit={this.handleSubmit}>
          <input className="form-control" ref="newPOI" type="text" placeholder="New Point of Interest"/>
          <p></p>
          <button className="btn btn-info form-control" type="submit">
            Add Point of Interest
          </button>
        </form>
      </div>
    );
  }
}

export default AddPOI;
