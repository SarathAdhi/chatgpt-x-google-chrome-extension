const div = document.createElement("div");
const extensionContainer1 = document.createElement("div");
const extensionContainer2 = document.createElement("div");
extensionContainer1.className = "extension__side__container";
extensionContainer2.className = "extension__side__container";

(document.onload = () => {
  chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
    if (obj.name === "google-query") {
      const mainContainer = document.getElementById("rcnt");

      let childrens = [];

      const style = document.createElement("style");

      extensionContainer1.innerHTML = `
        <h3>OpenAI x Google</h3>

        <p class="fade-ani">Waiting for the response...</p>
      `;

      extensionContainer2.innerHTML = `
        <h3>ChatGPT x Google</h3>

        <p class="fade-ani">Waiting for the response...</p>
      `;

      const rhs = document.getElementById("rhs");

      if (rhs) {
        rhs.prepend(extensionContainer1);
        rhs.prepend(extensionContainer2);
      } else {
        if (mainContainer.childNodes.length >= 2) {
          mainContainer.childNodes.forEach((e, index) => {
            if (index === 0) return;

            childrens.push(e);
            e.remove();
          });
        }

        console.log({ childrens });

        if (childrens.length > 0) {
          childrens.forEach(async (e) => {
            await div.appendChild(e);
          });
        }

        div.prepend(extensionContainer1);
        div.prepend(extensionContainer2);
      }

      mainContainer.append(div);

      style.innerHTML = `
        div#rcnt {
          flex-wrap: nowrap;
          ${rhs ? "" : "gap: 100px;"}
        }

        .extension__side__container {
          display: flex;
          flex-direction: column;
          border: 0.5px solid #3d4043;
          border-radius: 10px;
          margin-bottom: 10px;
          background: #0D1117;
        }

        .extension__side__container h3 {
          font-weight: 600;
          margin: 0px;
          padding: 0px;
          padding: 10px 15px;
          border-bottom: 0.5px solid #3d4043
        }

        .extension__side__container p {
          margin: 0px;
          padding: 0px;
          padding: 15px;
          white-space: pre-wrap;
          font-size: 16px;
          line-height: 1.2;
        }
        
        .extension__side__container .fade-ani {
          animation: fade 1s ease-in-out infinite;
        }
        
        @keyframes fade {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `;

      document.body.appendChild(style);

      const you_Fetcher = await fetch(
        `https://you.com/api/youchatStreaming?question=${obj.query}&chat=%5B%5D`
      );

      let youScrappedText = "";

      let you_Scrapper = await you_Fetcher.text();
      you_Scrapper = you_Scrapper.replaceAll("event: token\ndata: ", "");
      you_Scrapper = you_Scrapper.split("\n");

      you_Scrapper.forEach((e) => {
        if (e.includes('{"token":') && !e.includes("[[")) {
          let x = JSON.parse(e);
          youScrappedText = youScrappedText + x.token;
        }
      });

      extensionContainer2.innerHTML = `
        <h3>ChatGPT x Google</h3>

        <p>${youScrappedText}</p>
      `;

      let hashed_token = [
        ..."um/32XVFGE5gwT533MFXn[gV5DndmHLOrLUjP3sYoQM9YouFkL{",
      ];
      let newToken = [];

      hashed_token.forEach((e) => {
        newToken.push(String.fromCharCode(e.charCodeAt(0) - 2));
      });

      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${newToken.join("")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: obj.query,
          temperature: 0,
          max_tokens: 1000,
        }),
      });

      const result = await response.json();

      let text = result.choices[0].text?.split("\n\n");
      text.shift();
      text = text.join("\n\n");

      extensionContainer1.innerHTML = `
        <h3>OpenAI x Google</h3>

        <p>${text}</p>
      `;
    }
  });
})();
