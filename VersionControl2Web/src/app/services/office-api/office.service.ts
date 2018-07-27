import { Injectable } from "@angular/core";
import { OoxmlParser } from "./ooxml-parser.service";

// Office variables
declare let Office: any;
declare let Word: any;
declare let OfficeExtension: any;

@Injectable()
export class OfficeService {

  constructor(private xmlParser: OoxmlParser) { }

  /**
   * Adds a binding to a named item in the document
   * function to reduce amount of count and if no additional features are necessary
   *
   * @param itemName
   * @param bindingType
   * @param options
   * @param callback
   */
  addBindingFromNamedItem(itemName: string, bindingType: any, bindingId: string, callback?) { // ToDo add BindingType

    Office.context.document.bindings.addFromNamedItemAsync(itemName, bindingType, { id: bindingId }, (asyncResult) => {

      if (asyncResult.status == Office.AsyncResultStatus.Failed) {
        console.log('Biding - Action failed. Error: ' + asyncResult.error.message);
      } else {
        console.log('Binding - Added new binding with type: ' + asyncResult.value.type + ' and id: ' + asyncResult.value.id);

        callback();
      }
    });

    // ToDo: destroy handler after usage

  }

  /**
   * get the xml representation of the whole document
   * 
   */
  getOoxml() {

    return new Promise((resolve, reject) => {

      Word.run((context) => {

        // get ooxml of the whole document
        var bodyOOXML = context.document.body.getOoxml();

        // Synchronize the document state by executing the queued commands,
        // and return a promise to indicate task completion.
        return context.sync().then(() => {
          resolve(bodyOOXML.value.toString());
        });
      })
        .catch((error) => {
          reject("Error: " + JSON.stringify(error));
        });
    });
  }

  /**
   * set whole document to the given xml string
   * 
   * @param xml 
   */
  setOoxml(xml: string) {

    Word.run((context) => {

      // set content from xml param
      context.document.body.insertOoxml(xml, 'Replace');

      // Synchronize the document state by executing the queued commands,
      // and return a promise to indicate task completion.
      return context.sync().then(() => {
        //console.log("Body OOXML updated");
      });
    })
      .catch((error) => {
        console.log("Error: " + JSON.stringify(error));
        if (error instanceof OfficeExtension.Error) {
          console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
      });
  }

  getRequirementTemplate(params: string[]) {

    return new Promise((resolve, reject) => {
      var text, parser, xmlDoc;

      var view = {
        title: "Joe",
        calc: function () {
          return 2 + 4;
        }
      };

      this.xmlParser.loadTemplate('requirement.template', { name: 'Test' })
        .subscribe(console.log);

      text = "<bookstore><book>" +
        "<title>Everyday Italian</title>" +
        "<author>Giada De Laurentiis</author>" +
        "<year>2005</year>" +
        "</book></bookstore>";

      xmlDoc = this.xmlParser.getXML(text)
      console.log(xmlDoc);

      //document.getElementById("demo").innerHTML =
      //xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;

      resolve(this.xmlParser.getString(xmlDoc));

    });
  }
}