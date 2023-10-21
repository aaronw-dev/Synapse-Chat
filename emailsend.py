import smtplib
import os
import email.message
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

with open("serverside/emailusername.key", "r") as file:
    emailaddr = file.read()
with open("serverside/emailpass.key", "r") as file:
    password = file.read()


def sendEmail(sentfrom: str, recipient: str, subject: str, content: str):
    s = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    s.ehlo()
    try:
        s.login(emailaddr, password)
    except Exception as errorcode:
        print("Error logging in: " + str(errorcode))
    msg = email.message.EmailMessage()
    msg['from'] = sentfrom
    msg["to"] = recipient
    msg["Subject"] = subject
    msg.set_content(content)
    s.send_message(msg)
    return True
