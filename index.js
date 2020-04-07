const fs = require("fs");
const { DownloaderHelper } = require("node-downloader-helper");

if (!process.env.ECL_VERSION)
  return console.error("ECL_VERSION is required. Format: 2.22.0");

const version = process.env.ECL_VERSION;
const github = "https://github.com/ec-europa/europa-component-library";
const cdn = "https://cdn1.fpfis.tech.ec.europa.eu/ecl";
const sriFile = `europa-component-library-v${version}-sri.json`;
const targetDownload = `${__dirname}/downloads/${sriFile}`;

const getDocs = v => {
  const sri = require(targetDownload);

  const resourcesDocs = [];
  const resources = [
    "ecl-ec-preset-website.css",
    "ecl-ec-preset-website-print.css",
    "ecl-ec-preset-website.js"
  ];

  resources.forEach(file => {
    const integrity = sri[file].join(" ");

    if (file.includes(".css")) {
      if (file.includes("print")) {
        resourcesDocs.push(`
        \`\`\`html
        <link
          rel="stylesheet"
          href="${cdn}/v${v}/ec-preset-website/styles/${file}"
          integrity="${integrity}"
          crossorigin="anonymous"
          media="print"
        />
        \`\`\`
        `);
      } else {
        resourcesDocs.push(`
        \`\`\`html
        <link
          rel="stylesheet"
          href="${cdn}/v${v}/ec-preset-website/styles/${file}"
          integrity="${integrity}"
          crossorigin="anonymous"
          media="screen"
        />
        \`\`\`
        `);
      }
    }

    if (file.includes(".js")) {
      resourcesDocs.push(`
      \`\`\`html
      <script
        src="${cdn}/v${v}/ec-preset-website/styles/${file}"
        integrity="${integrity}"
        crossorigin="anonymous"
      ></script>
      \`\`\`
      `);
    }
  });

  return resourcesDocs.join(`\n`);
};

if (fs.existsSync(targetDownload)) {
  return console.log(`Notice: ${targetDownload} already exists.`);
}

const dl = new DownloaderHelper(
  `${github}/releases/download/v${version}/${sriFile}`,
  `${__dirname}/downloads`
);

dl.on("end", () => {
  console.log(`Paste these in the README.md: \n`, getDocs(version));
});

dl.start();
