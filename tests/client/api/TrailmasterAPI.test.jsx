'use strict';

/*----------Modules-----------*/
import expect from 'expect';

/*-----------React----------*/
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
/*----------Components----------*/
import {Header} from 'Header';
import {validateServerData} from 'TrailmasterAPI';

describe('TrailmasterAPI methods', () => {
  describe('validateServerData', () => {
    it('should return false for bad data', () => {
      let badData = {
        delete: false,
        geometry: {
          coordinates: []
        }
      };
      expect(validateServerData(badData)).toBe(false);
      badData = {
        delete: true,
        geometry: {
          coordinates: [1, 2, 3, 4]
        }
      };
      expect(validateServerData(badData)).toBe(false);
      badData = {
        delete: false,
        geometry: {
          type: 'LineString',
          coordinates: [[1, 2], [3, 4], [4]]
        }
      };
      expect(validateServerData(badData)).toBe(false);
    });

    it('should return true for all other data', () => {
      let badData = {
        delete: false,
        geometry: {
          coordinates: [1, 2, 3, 4]
        }
      };
      expect(validateServerData(badData)).toBe(true);
    });
  });
});
