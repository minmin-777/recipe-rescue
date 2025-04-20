from flask import Flask, request, jsonify
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
auth = HTTPBasicAuth()

# メモリ上のユーザーデータベース
users = {
    "TaroYamada": {
        "password": generate_password_hash("PaSsWd4Ty"),
        "nickname": "たろー",
        "comment": "僕は元気です"
    }
}

# Basic認証
@auth.verify_password
def verify_password(username, password):
    if username in users and check_password_hash(users[username]['password'], password):
        return username
    return None

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    user_id = data.get('user_id')
    password = data.get('password')

    if not user_id or not password:
        return jsonify({"message": "Account creation failed", "cause": "Required user_id and password"}), 400

    if not (6 <= len(user_id) <= 20 and user_id.isalnum()):
        return jsonify({"message": "Account creation failed", "cause": "Incorrect character pattern"}), 400

    if not (8 <= len(password) <= 20):
        return jsonify({"message": "Account creation failed", "cause": "Incorrect character pattern"}), 400

    if user_id in users:
        return jsonify({"message": "Account creation failed", "cause": "Already same user_id is used"}), 400

    users[user_id] = {
        "password": generate_password_hash(password),
        "nickname": user_id,
        "comment": ""
    }
    return jsonify({"message": "Account successfully created", "user": {"user_id": user_id, "nickname": user_id}}), 200

@app.route('/users/<user_id>', methods=['GET'])
@auth.login_required
def get_user(user_id):
    if user_id not in users:
        return jsonify({"message": "No user found"}), 404
    return jsonify({
        "message": "User details by user_id",
        "user": {
            "user_id": user_id,
            "nickname": users[user_id]['nickname'],
            "comment": users[user_id]['comment']
        }
    }), 200

@app.route('/users/<user_id>', methods=['PATCH'])
@auth.login_required
def update_user(user_id):
    if user_id != auth.current_user():
        return jsonify({"message": "No permission for update"}), 401

    if user_id not in users:
        return jsonify({"message": "No user found"}), 404

    data = request.get_json()
    nickname = data.get('nickname')
    comment = data.get('comment')

    if not nickname and not comment:
        return jsonify({"message": "User updation failed", "cause": "Required nickname or comment"}), 400

    if nickname is not None:
        users[user_id]['nickname'] = nickname
    if comment is not None:
        users[user_id]['comment'] = comment

    return jsonify({
        "message": "User successfully updated",
        "user": {
            "nickname": users[user_id]['nickname'],
            "comment": users[user_id]['comment']
        }
    }), 200

@app.route('/close', methods=['POST'])
@auth.login_required
def close_account():
    user_id = auth.current_user()
    users.pop(user_id, None)
    return jsonify({"message": "Account and user successfully deleted"}), 200

@auth.error_handler
def auth_error():
    return jsonify({"message": "Authentication failed"}), 401

if __name__ == '__main__':
    from waitress import serve
    serve(app, host='0.0.0.0', port=8080)
