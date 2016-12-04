/*----------Modules----------*/
import React from 'react';
import BaseComponent from 'BaseComponent';

class Controls extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  render() {
    return (
      <div className='controls'>
        <div id="accordion" role="tablist" aria-multiselectable="true">
          <div className="panel panel-primary">
            <div className="panel-heading" role="tab" id="headingOne">
              <h3 className='controls-title'>
                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  Points of Interest
                </a>
              </h3>
            </div>

            <div id="collapseOne" className="collapse in" role="tabpanel" aria-labelledby="headingOne">
              <div className="panel-body">
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
              </div>
            </div>
          </div>
          <div className="panel panel-primary">
            <div className="panel-heading" role="tab" id="headingTwo">
              <h3 className="controls-title">
                <a className="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  Routes
                </a>
              </h3>
            </div>
            <div id="collapseTwo" className="collapse" role="tabpanel" aria-labelledby="headingTwo">
              <div className="panel-body">
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
              </div>
            </div>
          </div>
          <div className="panel panel-primary">
            <div className="panel-heading" role="tab" id="headingThree">
              <h3 className='controls-title'>
                <a className="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  Trails
                </a>
              </h3>
            </div>
            <div id="collapseThree" className="collapse" role="tabpanel" aria-labelledby="headingThree">
              <div className="panel-body">
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Controls; // <- add me
