from flask import Flask, request, jsonify
import json
# import PyPDF2
from AI_Resume_Parser import *
from flask_cors import CORS, cross_origin
import pymongo
from flask_pymongo import PyMongo
from bson.json_util import dumps
app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# API endpoint to process the PDF file
@app.route('/parse_resume', methods=['POST'])
@cross_origin()
def parse_resume():
    # Check if the request contains a file
    if 'file' not in request.files:
        return jsonify({'error': 'No file found in the request'}), 400

    file = request.files['file']
    file.save('resume_new1.pdf')

    # Read the contents of the file
    file_contents = file.read()
    
    # Check if the file is a PDF
    if file.filename.endswith('.pdf'):
        try:
            input_text = extract_text_from_pdf('resume_new1.pdf')

            # Extract Data from Resume Text using OpenAI and append to response.txt
            resume_parser_openai(input_text, prompt_file='prompt.txt')

            # Read response.txt
            response = read_file_content('response.txt')

            # Parse text using Regex and populate JSON
            json_output = resume_parser_json(response)
            
            return jsonify(json_output), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file format. Only PDF files are supported'}), 400



# Replace the URI below with your actual MongoDB URI
# Mongo version - 3.4 and pymongo - 3.4
app.config["MONGO_URI"] = "mongodb://localhost:27017/userdatabase"
mongo = PyMongo(app)

@app.route('/getuser', methods=['GET'])
def get_user():
    username = request.args.get('username')  # extract username from the query parameter

    if not username:
        return jsonify({"error": "Username not provided"}), 400
        
    user_collection = mongo.db.users  # assume you have a "users" collection in your DB
    user = user_collection.find_one({'username': username})  # fetch user from MongoDB

    if not user:
        return jsonify({"error": "User not found"}), 404

    # if user is found, convert it from BSON to JSON and return it
    return dumps(user), 200


@app.route('/createorupdateuser', methods=['POST'])
def update_or_create_user():
    req_data = request.get_json()  # get JSON from request

    username = req_data.get('username')  # extract username from JSON data
    data = req_data.get('data')  # extract new data from JSON data

    if not username or not data:
        return jsonify({"error": "Username or data not provided"}), 400

    user_collection = mongo.db.users  # assume you have a "users" collection in your DB
    user = user_collection.find_one({'username': username})  # fetch user from MongoDB

    if user:  # if user exists, update its data
        user_collection.update_one({'username': username}, {'$set': {'data': data}})
        return jsonify({"message": f"User {username} updated successfully"}), 200

    else:  # if user does not exist, create new user
        user_collection.insert_one({'username': username, 'data': data})
        return jsonify({"message": f"User {username} created successfully"}), 201


if __name__ == "__main__":
    app.run(debug=True)



