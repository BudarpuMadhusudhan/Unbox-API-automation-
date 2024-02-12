class StringUtility {

  /**
   * @description This method is used to replace a Data in a given string by providing following parameters
   * @param {string} originalString
   * @param {string | RegExp} dataToReplace
   * @param {string} replacementData
   * @author SWARAJ <swaraj.t@unboxrobotics.com>
   */
  async replaceData(originalString, dataToReplace, replacementData) {
    return originalString.replace(new RegExp(dataToReplace, "g"), replacementData);
  }

  /**
 * @description This method is used to convert JSON String to JSON Object
 * @param {string} jsonString
 * @author SWARAJ <swaraj.t@unboxrobotics.com>
 */
  async stringToJsonObject(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON string:', error);
      return null;
    }
  }

/**
* @description This method is used to concate two strings
* @param {string} string1
* @param {string} string2
* @author SWARAJ <swaraj.t@unboxrobotics.com>
*/
  async concatenateStrings(string1, string2) {
    return string1 + string2;
  }

  /**
   *@description This method is ised to replace multiple values in a string by providing below parameters 
   * @param {string} originalString
   * @param {{ [x: string]: any; }} replacements
   */
  async replaceMultiple(originalString, replacements) {
    let result = originalString;
    for (const searchValue in replacements) {
      const replaceValue = replacements[searchValue];
      const regex = new RegExp(searchValue, 'g');
      result = result.replace(regex, replaceValue);
    }
    return result;
  }

  /**
   * @description This method is used to convert jsonObject to string
   * @param {object} jsonObject 
   * @author SWARAJ <swaraj.t@unboxrobotics.com> 
  */
  async jsonObjectToString(jsonObject) {
    return JSON.stringify(jsonObject);
  }

}
module.exports = new StringUtility();