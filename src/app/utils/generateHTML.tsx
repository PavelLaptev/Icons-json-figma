const generateHTML = (content: object, name: string, icons: object) => {
  return `

  <!doctype html>
  <html class="no-js" lang="en">
  
  <head>
    <meta charset="utf-8">
    <title>${name}</title>
    <meta name="description" content="icons preview">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;800&display=swap" rel="stylesheet">
  
    <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 40px;
    }

    svg {
      margin: 40px 0 10px;
    }

    .wrap {
      margin: 0 auto;
      max-width: 800px;
    }

    #icons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }

    .icon {
      display: flex;
      flex-direction: column;
    }

    .icon-name {
      font-size: 12px;
    }
  </style>
  
  </head>
  
  <body>
    <div class="wrap">
      <h1>Icons from ${name}.json</h1>
      <p>Find out more about <a href="https://david-gilbertson.medium.com/icons-as-react-components-de3e33cb8792"
          target="_blank">this
          method in this article</a></p>
      <div id="icons">
  
      </div>
    </div>
  
    <script>

      const jsonObject = ${JSON.stringify(content, null, 2)}
    
      function createIcon(d) {
        Object.keys(jsonObject).forEach(icon => {

          const iconWrap = document.createElement("div")
          iconWrap.className = "icon";

          const iconName = document.createElement("span")
          iconName.className = "icon-name";
          iconName.textContent = icon

          const xmlns = "http://www.w3.org/2000/svg";
          const svgElem = document.createElementNS(xmlns, "svg");
          svgElem.setAttributeNS(null, "viewBox", "${
            icons[Object.keys(icons)[0]].viewBox
          }");
          svgElem.setAttributeNS(null, "width", ${
            icons[Object.keys(icons)[0]].size.width
          });
          svgElem.setAttributeNS(null, "height", ${
            icons[Object.keys(icons)[0]].size.height
          });
          svgElem.setAttributeNS(null, 'fill', "black");
          svgElem.setAttributeNS(null, 'fill-rule', "evenodd");

          const path = document.createElementNS(xmlns, "path");
          path.setAttributeNS(null, 'd', jsonObject[icon]);
          svgElem.appendChild(path)

          iconWrap.appendChild(svgElem)
          iconWrap.appendChild(iconName)
          document.getElementById("icons").appendChild(iconWrap)
        });
      }

      createIcon(jsonObject)
  
    </script>
  </body>
  
  </html>
`;
};

export default generateHTML;
