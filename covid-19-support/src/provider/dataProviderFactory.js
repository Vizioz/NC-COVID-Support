//import {ProviderConfig} from './dataProvider'
import { dataProviderTypes } from '../constants'

export const providerFactory = {
    getProvider: function(type) {
        switch (type) {
            case dataProviderTypes.GoogleSpreadsheet:
                return "spreadsheet"
            case dataProviderTypes.Umbraco:
                return "umbraco"
            default:
                return null;
        }
    }
  }