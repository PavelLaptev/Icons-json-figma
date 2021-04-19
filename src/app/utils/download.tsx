import { saveAs } from "file-saver";
import JSZip from "jszip";
import { generateHTML } from "./";

const download = (content: object, fileName: string, data: object) => {
  var zip = new JSZip();

  let htmlString = generateHTML(content, fileName, data);

  zip.file(`icons-preview.html`, htmlString);
  zip.file(`${fileName}.json`, JSON.stringify(content, null, 2));
  zip.generateAsync({ type: "blob" }).then(function(content) {
    saveAs(content, `${fileName}.zip`);
  });
};

export default download;
