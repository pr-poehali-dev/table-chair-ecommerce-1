import json
import os
import smtplib
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта, сохраняет в БД и отправляет на email"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    comment = body.get('comment', '').strip()
    cart = body.get('cart', [])

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и телефон обязательны'}, ensure_ascii=False),
        }

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {schema}.orders (name, phone, comment, cart) VALUES (%s, %s, %s, %s) RETURNING id",
        (name, phone, comment, json.dumps(cart, ensure_ascii=False))
    )
    order_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    _send_email(order_id, name, phone, comment, cart)

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'order_id': order_id}, ensure_ascii=False),
    }


def _send_email(order_id, name, phone, comment, cart):
    to_email = 'info.forma-mebel@mail.ru'
    from_email = 'info.forma-mebel@mail.ru'
    password = os.environ.get('SMTP_PASSWORD', '')

    cart_lines = ''
    total = 0
    if cart:
        for item in cart:
            item_total = item.get('price', 0) * item.get('qty', 1)
            total += item_total
            cart_lines += f"  • {item.get('name')} x{item.get('qty', 1)} — {item_total:,} ₽\n".replace(',', ' ')
        cart_lines += f"\nИТОГО: {total:,} ₽\n".replace(',', ' ')
    else:
        cart_lines = '  Корзина пуста (запрос консультации)\n'

    text = f"""Новая заявка #{order_id} с сайта "Мир Столов и Стульев"

Клиент: {name}
Телефон: {phone}
Комментарий: {comment or '—'}

Состав заказа:
{cart_lines}
"""

    msg = MIMEMultipart()
    msg['Subject'] = f'Новая заявка #{order_id} — {name}'
    msg['From'] = from_email
    msg['To'] = to_email
    msg.attach(MIMEText(text, 'plain', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(from_email, password)
        server.send_message(msg)
