# swagger_client.DefaultApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**convert_post**](DefaultApi.md#convert_post) | **POST** /convert | Uploads a file, converts it to a different format and return


# **convert_post**
> file convert_post(file, format)

Uploads a file, converts it to a different format and return

### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.DefaultApi()
file = '/path/to/file.txt' # file | The file to convert.
format = 'format_example' # str | Format to convert to. Some example formats: txt rtf doc docx ppt pptx xls xlsx csv html pdf latex bib bmp svg eps tiff png jpg gif apng mp3 ogg mp4 avi webm mkv mov flv 

try:
    # Uploads a file, converts it to a different format and return
    api_response = api_instance.convert_post(file, format)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling DefaultApi->convert_post: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **file**| The file to convert. | 
 **format** | **str**| Format to convert to. Some example formats: txt rtf doc docx ppt pptx xls xlsx csv html pdf latex bib bmp svg eps tiff png jpg gif apng mp3 ogg mp4 avi webm mkv mov flv  | 

### Return type

[**file**](file.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: audio/*; charset=utf-8, image/*; charset=utf-8, video/*; charset=utf-8, application/*; charset=utf-8

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

