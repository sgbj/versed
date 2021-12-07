import time
import swagger_client
from swagger_client.rest import ApiException
from swagger_client.configuration import Configuration
from pprint import pprint

# create an instance of the API class
configuration = Configuration()
configuration.host = "http://localhost:3000"
api_instance = swagger_client.DefaultApi(
    swagger_client.ApiClient(configuration)
)
file = "/tmp/convtst.xlsx"
format = "pdf"

try:
    # Uploads a file, converts it to a different format and return
    api_response = api_instance.convert_post(
        file,
        format,
        _preload_content=False,
    )
    if api_response.status == 200:
        print("Success!")

        f = open("result.pdf", "wb")
        f.write(api_response.data)
        f.close()
        print("Converted file: ./result.pdf")

    else:
        print("Result HTTP code: ", api_response.status)

except ApiException as e:
    print("Exception when calling DefaultApi->convertPost: %s\n" % e)