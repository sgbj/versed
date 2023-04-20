# Versed
File conversion can be a pain. Especially when you're trying to automate it. That's why I created Versed, a microservice specifically for that purpose.

Versed exposes a web API for converting files, and also comes with a simple web frontend for manual file conversion. 

![Versed frontend](https://user-images.githubusercontent.com/5178445/29902290-c7bd44d4-8dc2-11e7-9aca-6ff17b264971.png)

It's currently powered by LibreOffice and FFmpeg, which means it supports the same file formats that those tools support, but you can easily add more tools to its arsenal.

Read the [blog post](http://aka.sb/Versed) to learn more!

## Getting started

Run the following commands to get up and running.

```shell
git clone https://github.com/sgbj/versed.git
cd versed
docker build -t versed .
# This app uses https://github.com/debug-js/debug 
# and if you want to see more logging use the DEBUG environment variable,
# We've added an authentication layer using an API_TOKEN.
# If you want to enable authentication you'll need to generate a token and set it as API_TOKEN value when creating the container.
# This token we'll be used by the client to make request to the API.
docker run -it --rm -e DEBUG=versed* -e API_TOKEN=<API_TOKEN> -p 3000:3000 versed
```

Open a browser window and go to http://localhost:3000/.

## OpenAPI

You can access the OpenAPI (aka Swagger) 2.0 spec by accessing http://localhost:3000/openapi-spec.yaml or by opening the file in the public/ folder of the repo.
You can generate a client for this microservice by using https://editor.swagger.io/.
An example Python client (and an example usage script) is included in the clients/ folder of the repo.

## Calling it from Node

One way to consume the convert endpoint in Node.js code is by using the [request package](https://www.npmjs.com/package/request). 

```js
const fs = require('fs');
const request = require('request');

let req = request.post({
    url: 'http://localhost:3000/convert',
    headers: { "Authorization": `Bearer ${API_TOKEN}` }
});

let form = req.form();
form.append('file', fs.createReadStream('video.mp4'));
form.append('format', 'gif');
req.pipe(fs.createWriteStream('image.gif'));
```

## Calling it using curl

```shell
# this will convert `testdata/file-sample_100kB.docx` to pdf and save it using the filename given in the resonse header.
curl -H "Authorization: Bearer <API_TOKEN>" -F format=pdf -F "file=@testdata/file-sample_100kB.docx" -OJ  http://localhost:3000/convert

```

## Calling it using Python

```python

import requests

files = {"file": open("demo.docx", "rb")}
response = requests.post(
    "http://localhost:3000/convert",
    files=files,
    data={"format": "pdf"},
    headers={"Authorization": f"Bearer {API_TOKEN}"},
)
with open("demo.pdf", "wb+") as fp:
    fp.write(response.content)

```
