import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import  {google}  from "googleapis";
import bodyParser from "body-parser";
import path from "path";
import { authenticate } from "@google-cloud/local-auth";
import fs from "fs";
import formidable
 from "formidable";
 import { Url } from "url";
 import http from "http";
 import https from "https";

const credentials={
  "web": {
    "client_id": "749260043420-0ugp4kj2blqa8u83136surqlmd3s3l1i.apps.googleusercontent.com",
    "project_id": "greendeckproject",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "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",
    "redirect_uris": ["http://localhost:3000"],
    "javascript_origins": ["http://localhost:5000"]
  }
}

// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/mood", moodRoutes);
// app.use(notFound);
// app.use(errorHandler);
const client_id = credentials.web.client_id;
const client_secret = credentials.web.client_secret;
const redirect_uris = credentials.web.redirect_uris;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const SCOPE = [
  "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email",
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send(" API Running"));

app.get("/getAuthURL", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPE,
  });
  console.log(authUrl);
  return res.send(authUrl);
});

app.post("/getToken", (req, res) => {
  if (req.body.code == null) return res.status(400).send("Invalid Request");
  oAuth2Client.getToken(req.body.code, (err, token) => {
    if (err) {
      console.error("Error retrieving access token", err);
      return res.status(400).send("Error retrieving access token");
    }
    res.send(token);
  });
});


app.post("/getUserInfo", (req, res) => {
  if (req.body.token == null) return res.status(400).send("Token not found");
  oAuth2Client.setCredentials(req.body.token);
  const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });

  oauth2.userinfo.get((err, response) => {
    if (err) res.status(400).send(err);
    console.log(response.data);
    res.send(response.data);
  });
});




app.post("/sheet", (req, res) => {
  if (req.body.token == null) return res.status(400).send("Token not found");
  oAuth2Client.setCredentials(req.body.token);
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
   const result = sheets.spreadsheets.get({
     spreadsheetId: req.body.spreadsheetId,
        fields:"sheets.properties"
   }).then(data=>{
    res.send(data.data.sheets)
   }).catch(err=>{
    res.send(err)
   })

});
app.post("/sheetdetials", (req, res) => {
  if (req.body.token == null) return res.status(400).send("Token not found");
  oAuth2Client.setCredentials(req.body.token);
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
   const result = sheets.spreadsheets.values
     .batchGet({
       spreadsheetId: req.body.id,
       
       // The A1 notation or R1C1 notation of the range to retrieve values from.
       ranges: `${req.body.range}!A1:z1`,
       // The ID of the spreadsheet to retrieve data from.

       // How values should be represented in the output. The default render option is ValueRenderOption.FORMATTED_VALUE.
       valueRenderOption: "UNFORMATTED_VALUE",
       majorDimension:"COLUMNS"
     })
     .then((data) => {
      
      res.send(data.data.valueRanges[0].values);
      
     })
     .catch((err) => {
       res.send(err);
     });

});



app.post("/readDrive", (req, res) => {
  if (req.body.token == null) return res.status(400).send("Token not found");
  oAuth2Client.setCredentials(req.body.token);
  const drive = google.drive({ version: "v3", auth: oAuth2Client });
  drive.files.list(
    {
      q: "mimeType='application/vnd.google-apps.spreadsheet'",
      pageSize: 900,
    },
    (err, response) => {
      if (err) {
        console.log("The API returned an error: " + err);
        return res.status(400).send(err);
      }
      const files = response.data.files;
      if (files.length) {
        console.log("Files:");
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log("No files found.");
      }
      res.send(files);
    }
  );
});

app.post("/fileUpload", (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).send(err);
    const token = JSON.parse(fields.token);
    console.log(token);
    if (token == null) return res.status(400).send("Token not found");
    oAuth2Client.setCredentials(token);
    console.log(files.file);
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    const fileMetadata = {
      name: files.file.name,
    };
    const media = {
      mimeType: files.file.type,
      body: fs.createReadStream(files.file.path),
    };
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id",
      },
      (err, file) => {
        oAuth2Client.setCredentials(null);
        if (err) {
          console.error(err);
          res.status(400).send(err);
        } else {
          res.send("Successful");
        }
      }
    );
  });
});

app.post("/deleteFile/:id", (req, res) => {
  if (req.body.token == null) return res.status(400).send("Token not found");
  oAuth2Client.setCredentials(req.body.token);
  const drive = google.drive({ version: "v3", auth: oAuth2Client });
  var fileId = req.params.id;
  drive.files.delete({ fileId: fileId }).then((response) => {
    res.send(response.data);
  });
});

app.post("/download/:id", (req, res) => {
  if (req.body.token == null) return res.status(400).send("Token not found");
  oAuth2Client.setCredentials(req.body.token);
  const drive = google.drive({ version: "v3", auth: oAuth2Client });
  var fileId = req.params.id;
  drive.files.get(
    { fileId: fileId, alt: "media" },
    { responseType: "stream" },
    function (err, response) {
      response.data
        .on("end", () => {
          console.log("Done");
        })
        .on("error", (err) => {
          console.log("Error", err);
        })
        .pipe(res);
    }
  );
});






dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server running on ${PORT}`));
