import sqlite3
from sqlite3 import Error
import os
from decouple import config

DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.sqlite')

def init_db():
    """Initialize the database with schema"""
    try:
        # Remove existing database file if it exists
        if os.path.exists(DATABASE_PATH):
            os.remove(DATABASE_PATH)
            print("Removed existing database")

        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create users table with additional fields
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE COLLATE NOCASE,
            password TEXT NOT NULL,
            full_name TEXT NOT NULL,
            country_code TEXT NOT NULL,
            whatsapp_number TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(country_code, whatsapp_number)
        )
        ''')
        
        # Create tags table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            color TEXT DEFAULT '#3490dc',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id, name)
        )
        ''')
        
        # Create contacts table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            country_code TEXT,
            whatsapp_number TEXT,
            company TEXT,
            avatar_url TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        ''')
        
        # Create contact_tags junction table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_tags (
            contact_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (contact_id, tag_id),
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        )
        ''')
        
        # Create indexes
        cursor.execute('CREATE INDEX IF NOT EXISTS email_idx ON users(email)')
        cursor.execute('CREATE INDEX IF NOT EXISTS phone_idx ON users(country_code, whatsapp_number)')
        cursor.execute('CREATE INDEX IF NOT EXISTS contacts_user_idx ON contacts(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS contacts_phone_idx ON contacts(country_code, whatsapp_number)')
        cursor.execute('CREATE INDEX IF NOT EXISTS tags_user_idx ON tags(user_id)')
        
        conn.commit()
        print("Database initialized successfully")
    except Error as e:
        print(f"Error initializing database: {e}")
    finally:
        if conn:
            conn.close()

def dict_factory(cursor, row):
    """Convert database row objects to a dictionary"""
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

def get_db_connection():
    """Create a database connection"""
    try:
        # Ensure the database directory exists
        os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
        
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = dict_factory
        
        # Enable foreign key support
        conn.execute('PRAGMA foreign_keys = ON')
        
        return conn
    except Error as e:
        print(f"Error connecting to database: {e}")
        raise e

def get_user_by_email(email):
    """Helper function to get user by email"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ? COLLATE NOCASE', (email,))
        return cursor.fetchone()
    finally:
        if conn:
            conn.close()

def create_user(email, hashed_password, full_name, country_code, whatsapp_number):
    """Helper function to create a new user"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (email, password, full_name, country_code, whatsapp_number) VALUES (?, ?, ?, ?, ?)',
            (email, hashed_password, full_name, country_code, whatsapp_number)
        )
        conn.commit()
        return get_user_by_email(email)
    finally:
        if conn:
            conn.close()

def get_user_by_whatsapp(country_code, whatsapp_number):
    """Helper function to get user by WhatsApp number"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE country_code = ? AND whatsapp_number = ?', 
                      (country_code, whatsapp_number))
        return cursor.fetchone()
    finally:
        if conn:
            conn.close()

# Tags related functions
def create_tag(user_id, name, color=None):
    """Create a new tag"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        if color:
            cursor.execute(
                'INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)',
                (user_id, name, color)
            )
        else:
            cursor.execute(
                'INSERT INTO tags (user_id, name) VALUES (?, ?)',
                (user_id, name)
            )
        conn.commit()
        return cursor.lastrowid
    finally:
        if conn:
            conn.close()

def get_tags(user_id):
    """Get all tags for a user"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM tags WHERE user_id = ? ORDER BY name', (user_id,))
        return cursor.fetchall()
    finally:
        if conn:
            conn.close()

def update_tag(tag_id, user_id, name=None, color=None):
    """Update a tag"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        updates = []
        values = []
        if name is not None:
            updates.append('name = ?')
            values.append(name)
        if color is not None:
            updates.append('color = ?')
            values.append(color)
        if updates:
            values.extend([user_id, tag_id])
            cursor.execute(
                f'UPDATE tags SET {", ".join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND id = ?',
                values
            )
            conn.commit()
            return True
        return False
    finally:
        if conn:
            conn.close()

def delete_tag(tag_id, user_id):
    """Delete a tag"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM tags WHERE id = ? AND user_id = ?', (tag_id, user_id))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        if conn:
            conn.close()

# Contacts related functions
def create_contact(user_id, contact_data, tag_ids=None):
    """Create a new contact with optional tags"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insert contact
        cursor.execute('''
            INSERT INTO contacts (
                user_id, name, email, phone, country_code, whatsapp_number,
                company, avatar_url, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            contact_data['name'],
            contact_data.get('email'),
            contact_data.get('phone'),
            contact_data.get('country_code'),
            contact_data.get('whatsapp_number'),
            contact_data.get('company'),
            contact_data.get('avatar_url'),
            contact_data.get('notes')
        ))
        
        contact_id = cursor.lastrowid
        
        # Add tags if provided
        if tag_ids:
            for tag_id in tag_ids:
                cursor.execute(
                    'INSERT INTO contact_tags (contact_id, tag_id) VALUES (?, ?)',
                    (contact_id, tag_id)
                )
        
        conn.commit()
        return get_contact(contact_id, user_id)
    finally:
        if conn:
            conn.close()

def get_contact(contact_id, user_id):
    """Get a single contact with its tags"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get contact details
        cursor.execute('''
            SELECT c.*, GROUP_CONCAT(t.id) as tag_ids, GROUP_CONCAT(t.name) as tag_names, 
                   GROUP_CONCAT(t.color) as tag_colors
            FROM contacts c
            LEFT JOIN contact_tags ct ON c.id = ct.contact_id
            LEFT JOIN tags t ON ct.tag_id = t.id
            WHERE c.id = ? AND c.user_id = ?
            GROUP BY c.id
        ''', (contact_id, user_id))
        
        contact = cursor.fetchone()
        if contact:
            # Process tags
            if contact['tag_ids']:
                contact['tags'] = [
                    {'id': tid, 'name': tname, 'color': tcolor}
                    for tid, tname, tcolor in zip(
                        contact['tag_ids'].split(','),
                        contact['tag_names'].split(','),
                        contact['tag_colors'].split(',')
                    )
                ]
            else:
                contact['tags'] = []
                
            # Clean up concatenated fields
            del contact['tag_ids']
            del contact['tag_names']
            del contact['tag_colors']
            
        return contact
    finally:
        if conn:
            conn.close()

def get_contacts(user_id, page=1, per_page=20, search=None, tag_id=None):
    """Get paginated contacts with optional search and tag filter"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Base query
        query = '''
            SELECT c.*, GROUP_CONCAT(t.id) as tag_ids, GROUP_CONCAT(t.name) as tag_names,
                   GROUP_CONCAT(t.color) as tag_colors
            FROM contacts c
            LEFT JOIN contact_tags ct ON c.id = ct.contact_id
            LEFT JOIN tags t ON ct.tag_id = t.id
            WHERE c.user_id = ?
        '''
        params = [user_id]
        
        # Add search condition if provided
        if search:
            query += ''' AND (
                c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ? OR 
                c.whatsapp_number LIKE ? OR c.company LIKE ?
            )'''
            search_param = f'%{search}%'
            params.extend([search_param] * 5)
        
        # Add tag filter if provided
        if tag_id:
            query += ' AND EXISTS (SELECT 1 FROM contact_tags WHERE contact_id = c.id AND tag_id = ?)'
            params.append(tag_id)
        
        # Add group by and pagination
        query += '''
            GROUP BY c.id
            ORDER BY c.name
            LIMIT ? OFFSET ?
        '''
        params.extend([per_page, (page - 1) * per_page])
        
        # Get total count for pagination
        count_query = 'SELECT COUNT(*) as total FROM contacts WHERE user_id = ?'
        count_params = [user_id]
        if search:
            count_query += ''' AND (
                name LIKE ? OR email LIKE ? OR phone LIKE ? OR 
                whatsapp_number LIKE ? OR company LIKE ?
            )'''
            count_params.extend([search_param] * 5)
        if tag_id:
            count_query += ''' AND EXISTS (
                SELECT 1 FROM contact_tags WHERE contact_id = contacts.id AND tag_id = ?
            )'''
            count_params.append(tag_id)
            
        # Execute queries
        cursor.execute(count_query, count_params)
        total = cursor.fetchone()['total']
        
        cursor.execute(query, params)
        contacts = cursor.fetchall()
        
        # Process contacts
        for contact in contacts:
            if contact['tag_ids']:
                contact['tags'] = [
                    {'id': tid, 'name': tname, 'color': tcolor}
                    for tid, tname, tcolor in zip(
                        contact['tag_ids'].split(','),
                        contact['tag_names'].split(','),
                        contact['tag_colors'].split(',')
                    )
                ]
            else:
                contact['tags'] = []
                
            # Clean up concatenated fields
            del contact['tag_ids']
            del contact['tag_names']
            del contact['tag_colors']
        
        return {
            'contacts': contacts,
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page
        }
    finally:
        if conn:
            conn.close()

def update_contact(contact_id, user_id, contact_data, tag_ids=None):
    """Update a contact and its tags"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Update contact details
        updates = []
        values = []
        for field in ['name', 'email', 'phone', 'country_code', 'whatsapp_number',
                     'company', 'avatar_url', 'notes']:
            if field in contact_data:
                updates.append(f'{field} = ?')
                values.append(contact_data[field])
        
        if updates:
            values.extend([user_id, contact_id])
            cursor.execute(
                f'''UPDATE contacts 
                    SET {", ".join(updates)}, updated_at = CURRENT_TIMESTAMP 
                    WHERE user_id = ? AND id = ?''',
                values
            )
        
        # Update tags if provided
        if tag_ids is not None:
            # Remove existing tags
            cursor.execute(
                'DELETE FROM contact_tags WHERE contact_id = ?',
                (contact_id,)
            )
            
            # Add new tags
            for tag_id in tag_ids:
                cursor.execute(
                    'INSERT INTO contact_tags (contact_id, tag_id) VALUES (?, ?)',
                    (contact_id, tag_id)
                )
        
        conn.commit()
        return get_contact(contact_id, user_id)
    finally:
        if conn:
            conn.close()

def delete_contact(contact_id, user_id):
    """Delete a contact"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM contacts WHERE id = ? AND user_id = ?', (contact_id, user_id))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        if conn:
            conn.close() 