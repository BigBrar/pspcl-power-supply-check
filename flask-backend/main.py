from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route('/', methods=['GET'])
def proxy_request():
    url = "https://distribution.pspcl.in/returns/module.php?to=Consumers.getDistricts&lang=en"
    resp = requests.get(url)
    try:
        data = resp.json()
    except ValueError:
        data = {"response": resp.text}
    return jsonify(data)


@app.route('/divisions', methods=['GET'])
def get_divisions():
    district_id = request.args.get('id')
    print('called with id ',district_id)
    if not district_id:
        return jsonify({"error": "Missing district id"}), 400
    url = f"https://distribution.pspcl.in/returns/module.php?to=Consumers.getDivisions&id={district_id}"
    resp = requests.get(url)
    try:
        data = resp.json()
    except ValueError:
        data = {"response": resp.text}
    return jsonify(data)


@app.route('/subdivisions', methods=['GET'])
def get_subdivisions():
    division_id = request.args.get('id')
    print('called with id ',division_id)
    if not division_id:
        return jsonify({"error": "Missing district id"}), 400
    url = f"https://distribution.pspcl.in/returns/module.php?to=Consumers.getSubDivisions&id={division_id}"
    resp = requests.get(url)
    try:
        data = resp.json()
    except ValueError:
        data = {"response": resp.text}
    return jsonify(data)


@app.route('/check_supply', methods=['GET'])
def get_supply_status():
    subdivision_id = request.args.get('id')
    print('called with id ',subdivision_id)
    if not subdivision_id:
        return jsonify({"error": "Missing district id"}), 400
    url = f"https://distribution.pspcl.in/returns/module.php?to=NCC.apiGetOfflineFeedersinSD&token={tokenid}&sdid={subdivision_id}"
    resp = requests.get(url)
    try:
        data = str(resp.text).split('(')[1].split(')')[0]
        
    except ValueError:
        data = {"response": resp.text}
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
