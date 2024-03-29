# swagger-client
No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)

This Python package is automatically generated by the [Swagger Codegen](https://github.com/swagger-api/swagger-codegen) project:

- API version: 1.0
- Package version: 1.0.0
- Build package: io.swagger.codegen.languages.PythonClientCodegen

## Requirements.

Python 2.7 and 3.4+

## Installation & Usage
### pip install

If the python package is hosted on Github, you can install directly from Github

```sh
pip install git+https://github.com//.git
```
(you may need to run `pip` with root permission: `sudo pip install git+https://github.com//.git`)

Then import the package:
```python
import swagger_client 
```

### Setuptools

Install via [Setuptools](http://pypi.python.org/pypi/setuptools).

```sh
python setup.py install --user
```
(or `sudo python setup.py install` to install the package for all users)

Then import the package:
```python
import swagger_client
```

## Getting Started

Please follow the [installation procedure](#installation--usage) and then run the following:

```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.DefaultApi(swagger_client.ApiClient(configuration))
file = '/path/to/file.txt' # file | The file to convert.
format = 'format_example' # str | Format to convert to. Some example formats: txt rtf doc docx ppt pptx xls xlsx csv html pdf latex bib bmp svg eps tiff png jpg gif apng mp3 ogg mp4 avi webm mkv mov flv 

try:
    # Uploads a file, converts it to a different format and return
    api_response = api_instance.convert_post(file, format)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling DefaultApi->convert_post: %s\n" % e)

```

## Documentation for API Endpoints

All URIs are relative to *https://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*DefaultApi* | [**convert_post**](docs/DefaultApi.md#convert_post) | **POST** /convert | Uploads a file, converts it to a different format and return


## Documentation For Models



## Documentation For Authorization

 All endpoints do not require authorization.


## Author



