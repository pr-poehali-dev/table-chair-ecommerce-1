import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Возвращает список активных товаров из каталога"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(f"""
        SELECT id, name, category, material, style, price, image_url, tag
        FROM {schema}.products
        WHERE is_active = true
        ORDER BY id ASC
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    products = [
        {
            'id': r[0],
            'name': r[1],
            'category': r[2],
            'material': r[3],
            'style': r[4],
            'price': r[5],
            'image': r[6],
            'tag': r[7],
        }
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'products': products}, ensure_ascii=False),
    }
