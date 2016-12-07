/*----------Modules----------*/
import React from 'react';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

class AddRoutes extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  render() {
    return (
      <div>
        <form ref="AddRoutes" onSubmit={this.handleSubmit}>
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

export default AddRoutes;
