from flask import Flask, send_from_directory, request, jsonify
import json, os

app = Flask(__name__, static_url_path='', static_folder='.')

# 首页
@app.route('/')
def root():
    return send_from_directory('.', 'index.html')

# 读取 JSON
@app.route('/m_de.json')
def json_file():
    return send_from_directory('.', 'm_de.json')

# 保存 JSON
@app.route('/save', methods=['POST'])
def save():
    with open('m_de.json', 'w', encoding='utf-8') as f:
        json.dump(request.get_json(), f, ensure_ascii=False, indent=4)
    return ('', 204)

if __name__ == '__main__':
    app.run(debug=True, port=8000)