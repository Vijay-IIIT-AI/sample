from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db_connection, init_db
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps
from decouple import config

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Load configuration
app.config['SECRET_KEY'] = config('JWT_SECRET', default='your-secret-key')
app.config['JWT_EXPIRATION_DELTA'] = timedelta(days=1)

# Initialize database
init_db()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        email = data.get('email')
        password = data.get('password')
        full_name = data.get('fullName')
        country_code = data.get('countryCode')
        whatsapp_number = data.get('whatsappNumber')

        # Validate required fields
        if not all([email, password, full_name, country_code, whatsapp_number]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Validate email format
        if '@' not in email:
            return jsonify({'error': 'Invalid email format'}), 400

        # Validate password length
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user exists
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        if cursor.fetchone():
            return jsonify({'error': 'User already exists'}), 400

        # Check if WhatsApp number exists for the country
        cursor.execute('SELECT * FROM users WHERE country_code = ? AND whatsapp_number = ?', 
                      (country_code, whatsapp_number))
        if cursor.fetchone():
            return jsonify({'error': 'WhatsApp number already registered'}), 400

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Insert new user
        cursor.execute(
            'INSERT INTO users (email, password, full_name, country_code, whatsapp_number) VALUES (?, ?, ?, ?, ?)',
            (email, hashed_password, full_name, country_code, whatsapp_number)
        )
        conn.commit()

        # Get the created user
        cursor.execute('SELECT id, email, full_name as name FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()

        print(f"User registered successfully: {email}")  # Debug log

        return jsonify({
            'user': user,
            'message': 'Registration successful'
        }), 201

    except Exception as e:
        print(f"Error during signup: {str(e)}")  # Debug log
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        email = data.get('email')
        password = data.get('password')

        # Validate required fields
        if not all([email, password]):
            return jsonify({'error': 'Missing required fields'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Find user
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()

        print(f"Login attempt for user: {email}")  # Debug log

        # Check if user exists
        if not user:
            print(f"User not found: {email}")  # Debug log
            return jsonify({'error': 'Invalid email or password'}), 401

        # Verify password
        try:
            stored_password = user['password']
            if isinstance(stored_password, str):
                stored_password = stored_password.encode('utf-8')
            
            is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_password)
            
            if not is_valid:
                print(f"Invalid password for user: {email}")  # Debug log
                return jsonify({'error': 'Invalid email or password'}), 401

        except Exception as e:
            print(f"Password verification error: {str(e)}")  # Debug log
            return jsonify({'error': 'Invalid email or password'}), 401

        # Generate token
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
        }, app.config['SECRET_KEY'])

        response = jsonify({
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name']
            },
            'message': 'Login successful'
        })

        # Set cookie
        response.set_cookie(
            'token',
            token,
            httponly=True,
            secure=config('FLASK_ENV', default='development') == 'production',
            samesite='Strict',
            max_age=86400  # 24 hours
        )

        print(f"Login successful for user: {email}")  # Debug log
        return response

    except Exception as e:
        print(f"Error during login: {str(e)}")  # Debug log
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        if 'conn' in locals():
            conn.close()

# Tags endpoints
@app.route('/api/tags', methods=['GET'])
@token_required
def get_user_tags(current_user):
    try:
        tags = get_tags(current_user['user_id'])
        return jsonify({'tags': tags})
    except Exception as e:
        print(f"Error getting tags: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/tags', methods=['POST'])
@token_required
def create_user_tag(current_user):
    try:
        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({'error': 'Name is required'}), 400
            
        tag_id = create_tag(
            current_user['user_id'],
            data['name'],
            data.get('color')
        )
        
        if tag_id:
            return jsonify({
                'id': tag_id,
                'name': data['name'],
                'color': data.get('color', '#3490dc')
            }), 201
        return jsonify({'error': 'Failed to create tag'}), 500
    except Exception as e:
        print(f"Error creating tag: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/tags/<int:tag_id>', methods=['PUT'])
@token_required
def update_user_tag(current_user, tag_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        success = update_tag(
            tag_id,
            current_user['user_id'],
            data.get('name'),
            data.get('color')
        )
        
        if success:
            return jsonify({'message': 'Tag updated successfully'})
        return jsonify({'error': 'Tag not found'}), 404
    except Exception as e:
        print(f"Error updating tag: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/tags/<int:tag_id>', methods=['DELETE'])
@token_required
def delete_user_tag(current_user, tag_id):
    try:
        success = delete_tag(tag_id, current_user['user_id'])
        if success:
            return jsonify({'message': 'Tag deleted successfully'})
        return jsonify({'error': 'Tag not found'}), 404
    except Exception as e:
        print(f"Error deleting tag: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Contacts endpoints
@app.route('/api/contacts', methods=['GET'])
@token_required
def get_user_contacts(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search')
        tag_id = request.args.get('tag_id', type=int)
        
        # Validate pagination parameters
        if page < 1:
            page = 1
        if per_page < 1 or per_page > 100:
            per_page = 20
            
        result = get_contacts(
            current_user['user_id'],
            page=page,
            per_page=per_page,
            search=search,
            tag_id=tag_id
        )
        
        return jsonify(result)
    except Exception as e:
        print(f"Error getting contacts: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/contacts/<int:contact_id>', methods=['GET'])
@token_required
def get_user_contact(current_user, contact_id):
    try:
        contact = get_contact(contact_id, current_user['user_id'])
        if contact:
            return jsonify(contact)
        return jsonify({'error': 'Contact not found'}), 404
    except Exception as e:
        print(f"Error getting contact: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/contacts', methods=['POST'])
@token_required
def create_user_contact(current_user):
    try:
        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({'error': 'Name is required'}), 400
            
        # Validate phone number format if provided
        if data.get('whatsapp_number') and not data.get('country_code'):
            return jsonify({'error': 'Country code is required for WhatsApp number'}), 400
            
        contact = create_contact(
            current_user['user_id'],
            data,
            data.get('tag_ids', [])
        )
        
        if contact:
            return jsonify(contact), 201
        return jsonify({'error': 'Failed to create contact'}), 500
    except Exception as e:
        print(f"Error creating contact: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/contacts/<int:contact_id>', methods=['PUT'])
@token_required
def update_user_contact(current_user, contact_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        # Validate phone number format if provided
        if data.get('whatsapp_number') is not None and data.get('country_code') is None:
            return jsonify({'error': 'Country code is required for WhatsApp number'}), 400
            
        contact = update_contact(
            contact_id,
            current_user['user_id'],
            data,
            data.get('tag_ids')
        )
        
        if contact:
            return jsonify(contact)
        return jsonify({'error': 'Contact not found'}), 404
    except Exception as e:
        print(f"Error updating contact: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/contacts/<int:contact_id>', methods=['DELETE'])
@token_required
def delete_user_contact(current_user, contact_id):
    try:
        success = delete_contact(contact_id, current_user['user_id'])
        if success:
            return jsonify({'message': 'Contact deleted successfully'})
        return jsonify({'error': 'Contact not found'}), 404
    except Exception as e:
        print(f"Error deleting contact: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 