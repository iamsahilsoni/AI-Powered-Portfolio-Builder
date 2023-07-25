import requests
import json

# The URL of the API you're trying to reach
url = 'http://127.0.0.1:5000/getuser'  # replace with your URL
url1 = 'http://127.0.0.1:5000/createorupdateuser'  # replace with your URL

# The data you want to pass in
# http://localhost:5000/get_user?username=jassi
data = {
    'username': 'ishmeet'
}

# Convert the data to JSON format
json_data = json.dumps(data)

# The headers for the request
headers = {'Content-Type': 'application/json'}

# Make the POST request
response = requests.get(url, headers=headers, data=json_data)

# Print the status code and response JSON
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

#  second method to call the update or create user


# The data you want to pass in
data1 = {
    'username': 'ishmeet',
    'data': {'value' : 'new_data','value' : 'new_data'}
}

# Convert the data to JSON format
json_data1 = json.dumps(data1)

# The headers for the request
headers1 = {'Content-Type': 'application/json'}

# Make the POST request
response = requests.post(url1, headers=headers1, data=json_data1)

# Print the status code and response JSON
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")
