import json
import os
import psycopg2


ADMIN_TOKEN = 'forma-admin-2024'


def handler(event: dict, context) -> dict:
    """CRUD для управления товарами через админ-панель"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Admin-Token') or headers.get('x-admin-token')
    if token != ADMIN_TOKEN:
        return {'statusCode': 401, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Unauthorized'})}

    method = event.get('httpMethod')
    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        if method == 'GET':
            cur.execute(f"SELECT id, name, category, material, style, price, image_url, tag, is_active FROM {schema}.products ORDER BY id ASC")
            rows = cur.fetchall()
            products = [
                {'id': r[0], 'name': r[1], 'category': r[2], 'material': r[3], 'style': r[4],
                 'price': r[5], 'image_url': r[6], 'tag': r[7], 'is_active': r[8]}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'products': products}, ensure_ascii=False)}

        body = json.loads(event.get('body') or '{}')

        if method == 'POST':
            cur.execute(
                f"INSERT INTO {schema}.products (name, category, material, style, price, image_url, tag, is_active) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                (body['name'], body['category'], body['material'], body['style'],
                 int(body['price']), body.get('image_url', ''), body.get('tag'), body.get('is_active', True))
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True, 'id': new_id})}

        if method == 'PUT':
            pid = body['id']
            cur.execute(
                f"UPDATE {schema}.products SET name=%s, category=%s, material=%s, style=%s, price=%s, image_url=%s, tag=%s, is_active=%s WHERE id=%s",
                (body['name'], body['category'], body['material'], body['style'],
                 int(body['price']), body.get('image_url', ''), body.get('tag'), body.get('is_active', True), pid)
            )
            conn.commit()
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}

        if method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            pid = params.get('id')
            cur.execute(f"DELETE FROM {schema}.products WHERE id=%s", (pid,))
            conn.commit()
            return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}

    finally:
        cur.close()
        conn.close()

    return {'statusCode': 405, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': ''}
