# coding:utf-8
from flask import Flask,request,json, jsonify,Blueprint
from flask_sqlalchemy import SQLAlchemy
from models import File,db,Info
from params import mailConfig
import smtplib 
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText    
from email.header import Header 
import time

blueprintFile = Blueprint('file', __name__)

@blueprintFile.route('/fileAdd',methods=['GET','POST'])
def fileAdd():
    tmp={}
    if request.method == 'POST':
        identity=request.values.get('identity')
        submitid=request.values.get('submitid')
        fname=request.values.get("fname")
        flink=request.values.get("flink")
        content=request.values.get("content")
        if not submitid or not fname or not flink or not content:
            tmp['status']='001'
            tmp['description']='缺少参数'
        elif identity!='1':
            # 无权限
            tmp['status']='002'
        elif identity=='1':
            file = File(submitid=submitid,fname=fname,flink=flink,content=content)
            db.session.add(file)
            try:
                db.session.commit()
                tmp['status']='100'
            except:
                db.session.rollback()
                tmp['status']='003'

            db.session.close()
    else:
        tmp['status']='004'
    return json.dumps(tmp,ensure_ascii=False)


@blueprintFile.route('/fileDelete',methods=['GET','POST'])
def fileDelete():
    tmp={}
    if request.method == 'POST':
        tableid=request.values.get('tableid')
        identity=request.values.get('identity')
        if not tableid:
            # 参数不全
            tmp['status']='001'
        elif identity!='1':
            # 无权限
            tmp['status']='002'
        elif identity=='1':
            File.query.filter_by(tableid=tableid).delete()
            try:
                db.session.commit()
                tmp['status']='100'
            except:
                db.session.rollback()
                # db error
                tmp['status']='003'
            db.session.close()
    else:
        # 请求方式错误
        tmp['status']='004'
    return json.dumps(tmp,ensure_ascii=False)

@blueprintFile.route('/fileGetAll')
def fileGetAll():
    t=[]
    file=File.query.all()
    length=File.query.count()
    db.session.close()
    if length!=0:
        for i in range(length):
            tt={}
            tt['tableid']=file[i].tableid
            tt['fname']=file[i].fname
            tt['flink']=file[i].flink
            tt['content']=file[i].content
            tt['submitid']=file[i].submitid
            # info=Info.query.filter(Info.id == file[i].submitid).first()
            
            t.append(tt)
        else:
            tt['status']='false'
    return json.dumps(t,ensure_ascii=False)

@blueprintFile.route('/fileDownload',methods=['GET','POST'])
def fileDownload():  
    t={}
    if request.method == 'POST':  
        fileUrl=request.values.get('fileUrl')
        fname=request.values.get('fname')
        email=request.values.get('email')
        if not fileUrl or not email or not fname:
            t['status']='false'
            t['fileUrl']=fileUrl
            t['email']=email
        else:
            message='''<html lang="en"><body>文件：'''+fname+'''<a href="'''+fileUrl+'''">点击下载</a><br><text>请在两个小时内下载哦，链接会在2h后失效~<text></body></html>'''
            # 构造邮件主题
            subject="hitwh网络中心-文件下载"
            subject=Header(subject, 'utf-8').encode()
            msg = MIMEMultipart('mixed')
            msg['Subject']=subject
            msg['From'] = mailConfig['user']
            receiver=mailConfig['user']+","+email
            msg['To'] =email
            # mailConfig['user']+";"+email
            
            #构造邮件内容
            # text = "文件"+fname+"的下载链接："+fileUrl+"\n"
            text_plain = MIMEText(message,'html', 'utf-8')    
            # text_plain = MIMEText(text,'plain', 'utf-8')    
            msg.attach(text_plain)

            smtp = smtplib.SMTP()
            smtp.connect('smtp.126.com',25) 
            smtp.login(mailConfig['user'],mailConfig['password']) 
            smtp.sendmail(mailConfig['user'],email,msg.as_string()) 
            smtp.quit()
            t['status']='true'
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)