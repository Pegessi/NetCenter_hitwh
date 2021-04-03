# coding:utf-8
from flask import Flask,request,json, jsonify,Blueprint,current_app
from flask_sqlalchemy import SQLAlchemy
from models import Info,db
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText    
from email.header import Header 
import smtplib 
import requests
from params import mailConfig,wxConfig,TECENT_TIMEOUT_INTERVAL

app = Flask(__name__)
blueprintUser = Blueprint('user', __name__)



@blueprintUser.route('/getOpenid')
def getOpenid():
    t={}
    res={}
    code=request.values.get('code')
    if not code:
        t['status']='false'
        t['description']='no code'

    else:
        reqParams = {
            "appid": wxConfig['appid'],  # 小程序的 ID
            "secret": wxConfig['secret'],  # 小程序的 secret
            "js_code": code,
            "grant_type": 'authorization_code'
        }
        try:
            reqResult = requests.get(wxConfig['url'], params=reqParams, timeout=TECENT_TIMEOUT_INTERVAL, verify=True)
            # res = reqResult.json()
            t['result']=reqResult.json()
            t['openid']=reqResult.json()['openid']
        except KeyError:
            t['status']='false'
            t['description']="Error in getting openid [jscode=%s]" % code
        except:
            t['status']='false'
            t['description']="Error in getting openid, Unknown Error [jscode=%s]" % code

    return json.dumps(t,ensure_ascii=False)

@blueprintUser.route('/userAdd',methods=['GET','POST'])
def userAdd():
    tmp={}
    if request.method == 'POST':
        openid=request.values.get('openid')
        iid=request.values.get("id")
        name=request.values.get("name")
        identity=request.values.get("identity")
        email=request.values.get("email")
        if not name or not openid or not iid or not identity or not email:
            tmp['status']='false'
            tmp['openid']=openid
            tmp['name']=name
            tmp['id']=iid
            tmp['identity']=identity
            tmp['email']=email
        else:
            info = Info(openid=openid,id=iid,name=name,identity=identity,email=email)
            db.session.add(info)
            try:
                db.session.commit()
                db.session.close()
            except:
                app.logger.error("Error in parse userAdd", exc_info=True)
                db.session.rollback()
            tmp['status']='true'
    else:
        tmp['status']='false'
    return json.dumps(tmp,ensure_ascii=False)


@blueprintUser.route('/userCheck')
def userCheck():
    t={}
    openid=request.values.get('openid')
    if not openid:
        t['status']='false'
    else:
        user =Info.query.filter(Info.openid == openid).first()
        # try:
        #     db.session.commit()
        # except:
        #     db.session.rollback()
        db.session.close()
        if user:
            t['tableid']=user.tableid
            t['openid']=user.openid
            t['name']=user.name
            t['id']=user.id
            t['identity']=user.identity
            t['email']=user.email
            t['status']='true'
    return json.dumps(t,ensure_ascii=False)


# 用户修改信息
@blueprintUser.route('/userUpdate',methods=['GET','POST'])
def userUpdate():
    t={}
    if request.method == 'POST':
        tableid=request.values.get('tableid')
        email=request.values.get("email")
        name=request.values.get("name")
        iid=request.values.get("id")

        if not tableid or not email or not name or not iid:
            t['status']='false'
            t['name']=name
            t['email']=email
            t['id']=iid
            t['description']='not enough data'
        else:
            user=Info.query.filter_by(tableid=tableid).update({'email':email,'name':name,'id':iid})
            try:
                db.session.commit()
            except:
                db.session.rollback()
            db.session.close()
            t['status']='true' 
            t['tableid']=tableid
            t['name']=name
            t['email']=email
            t['id']=iid
            t['email']=email
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

@blueprintUser.route('/userDelete',methods=['GET','POST'])
def userDelete():  
    t={}
    if request.method == 'POST':
        tableid=request.values.get('tableid')
        if not tableid:
            t['status']='false'
            t['description']='no tableid'
        else:
            # Repair.query.filter_by(tableid=tableid).delete()  
            # db.session.commit()
            # db.session.close()
            Info.query.filter_by(tableid=tableid).delete()
            try:
                db.session.commit()
            except:
                db.session.rollback()
            db.session.close()
            t['status']='true'
            t['tableid']=tableid
            # try:
            #     Info.query.filter_by(tableid=tableid).delete()
            #     db.session.commit()
            #     t['status']='true'

            # except:
            #     db.session.rollback()
            #     t['status']='false'
            #     t['description']='db error'
            # db.session.close()
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)


# 添加维修人员
@blueprintUser.route('/workmanAdd',methods=['GET','POST'])
def workmanAdd():
    t={}
    t['debug']="yes"
    if request.method == 'POST':
        iid=request.values.get('id')
        phone=request.values.get('phone')
        if not iid or not phone:
            t['status']='false'
            t['description']='no id or phone'
        else:
            info1=Info.query.filter_by(id=iid).first()
            info=Info.query.filter_by(id=iid).update({'identity':'2','phone':phone})
            
            try:
                
                t['status']='true' 
                email=info1.email
                # 给管理员发送邮件
                # 构造邮件主题
                subject="hitwh网络中心-通知"
                subject=Header(subject, 'utf-8').encode()
                msg = MIMEMultipart('mixed')
                msg['Subject']=subject
                msg['From'] = mailConfig['user']
                msg['To'] = email

                #构造邮件内容
                text = "恭喜您已成为维修人员，请进入小程序，点击‘个人中心’，进入账号绑定界面刷新身份信息" 
                text_plain = MIMEText(text,'plain', 'utf-8')  
                msg.attach(text_plain)

                smtp = smtplib.SMTP()
                smtp.connect('smtp.126.com',25)
                smtp.login(mailConfig['user'],mailConfig['password']) 
                smtp.sendmail(mailConfig['user'],email,msg.as_string()) 
                smtp.quit()
                db.session.commit()
                
            except:
                db.session.rollback()
                app.logger.error("Error in userUpdate:", exc_info=True) 
                t['status']='false'
            
            db.session.close()
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 删除维修人员
@blueprintUser.route('/workmanDelete',methods=['GET','POST'])
def workmanDelete():
    t={}
    if request.method == 'POST':
        identity=request.values.get('identity')
        iid=request.values.get('id')

        if not iid:
            # 数据不全
            t['status']='001'
            t['id']=iid
        elif identity!='1':
            # 无权限
            t['status']='002'
        elif identity=='1':
            try:
                info=Info.query.filter_by(id=iid).update({'identity':'3'})
                db.session.commit()
                t['status']='100' 
                t['id']=iid
                # user=Info.query.filter(tableid==tableid).first()
                # print(user)
                # user.email=email
                # db.session.commit()
                # current_app.db.session.query(Info).filter(Info.openid == '999').update({'email':email})
                # current_app.db.session.commit()
            except:
                # db error
                db.session.rollback()
                app.logger.error("Error in userUpdate:", exc_info=True) 
                t['status']='003'
            
            db.session.close()
    else:
        # 请求方式错误
        t['status']='004'
    return json.dumps(t,ensure_ascii=False)

# 获得所有维修人员
@blueprintUser.route('/workmanGet')
def workmanGet():
    user=Info.query.filter_by(identity='2').all()
    length=Info.query.filter_by(identity='2').count()
    
    db.session.close()
    if length!=0:
        t=[]
        tt={}
        for i in range(length):
            tt={}
            tt['id']=user[i].id
            tt['phone']=user[i].phone
            tt['name']=user[i].name
            tt['email']=user[i].email
            t.append(tt)
    else:
        t={}
        t['data']=''
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)         


@blueprintUser.route('/workmanCheck')
def workmanCheck():
    t={}
    iid=request.values.get('id')
    if not iid:
        t['status']='false'
        t['discription']='no iid '
    else:
        user =Info.query.filter_by(id = iid).all()
        length =Info.query.filter_by(id = iid).count()

        db.session.close()
        if length>0:
            t['status']='true'
            t['identity']=user[0].identity
        else:
            t['status']='false'
    return json.dumps(t,ensure_ascii=False)
        