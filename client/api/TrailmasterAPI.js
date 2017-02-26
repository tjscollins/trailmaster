import $ from 'jquery';

export const validateServerData = (data) => {
  let {coordinates, type} = data.geometry;

  if (coordinates.length <= 1) return false;
  if (type === 'LineString' && coordinates.filter((coord) => {
    return coord.length !== 2;
  }).length >0) return false;
  if (data.delete) return false;
  return true;
};

export const mapConfig = {
  user: {
    markerColor: '#120A8F',
    markerSize: 'large',
    markerSymbol: 'dot',
  },
  pois: {
  },
  routes: {

  },
  trails: {
  }
};

/*istanbul ignore next*/
export const toggleUI = (delay) => {
    if ($('.hidecontrols').hasClass('fa-arrow-left')) {
      // hide UI
      $('div.controls').addClass('hide-left');
      $('.hidecontrols').removeClass('fa-arrow-left').addClass('fa-arrow-right');
      $('#Header').addClass('minified-header').css('overflow', 'hidden');
      $('.headerhidecontrols').css('display', 'inline-block');
    } else {
      //show UI
      $('div.controls').removeClass('hide-left');
      $('.hidecontrols').removeClass('fa-arrow-right').addClass('fa-arrow-left');
      $('#Header').removeClass('minified-header');
      setTimeout(() => {
        $('#Header').css('overflow', 'visible');
        $('.headerhidecontrols').css('display', 'none');
      }, delay);
    }
  };
