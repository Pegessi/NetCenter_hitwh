# coding:utf-8
from flask import Flask,request,json, jsonify,Blueprint
from flask_sqlalchemy import SQLAlchemy
from models import Lostcard,db
import time

blueprintLostcard = Blueprint('lostcard', __name__)

# 发布失卡招领信息
@blueprintLostcard.route('/lostcardAdd',methods=['GET','POST'])
def lostcardAdd():
    t={}
    if request.method == 'POST':
        name=request.values.get('name')
        iid=request.values.get("id")
        description=request.values.get("description")
        contact=request.values.get("contact")
        ttype=request.values.get("type")
        submitid=request.values.get("submitid")
        date=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        if not name or not description or not submitid or not iid or not contact or not ttype:
            t['status']='false'
            t['description']=description
            t['name']=name
            t['id']=iid
            t['contact']=contact
            t['type']=ttype
            t['submitid']=submitid
        else:
            lostcard = Lostcard(type=ttype,date=date,description=description,id=iid,name=name,contact=contact,submitid=submitid,showflag='1')
            db.session.add(lostcard)
            try:
                db.session.commit()
                t['status']='true'
            except:
                db.session.rollback()
                t['status']='false'
                t['description']='db error'
            db.session.close()
            t['status']='true'
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 删除失卡招领信息，修改flag
@blueprintLostcard.route('/lostcardChange',methods=['GET','POST'])
def lostcardChange():  
    t={}
    if request.method == 'POST':
        tableid=request.values.get('tableid')
        if not tableid:
            t['status']='false'
        else:
            lostcard=Lostcard.query.filter_by(tableid=tableid).update({'showflag':0}) 
            
            try:
                db.session.commit()
                t['status']='true'
            except:
                db.session.rollback()
                t['status']='false'
                t['description']='db error'
            db.session.close()
            t['status']='true'
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 获取所有失卡招领信息
@blueprintLostcard.route('/lostcardGetAll')
def lostcardGetAll():
    t={}
    try:
        lostcard=Lostcard.query.order_by(db.desc('tableid')).filter_by(showflag=1).all()
        length=Lostcard.query.filter_by(showflag=1).count()
        db.session.close()
        if length!=0:
            tt={}
            t['data']=[]
            t['status']='true'
            for i in range(length):
                tt={}
                tt['tableid']=lostcard[i].tableid
                tt['name']=lostcard[i].name
                tt['id']=lostcard[i].id
                tt['description']=lostcard[i].description
                tt['contact']=lostcard[i].contact
                tt['type']=lostcard[i].type
                tt['submitid']=lostcard[i].submitid
                tt['date']=lostcard[i].date
                t['data'].append(tt)
        else:
            t['status']='true'
            t['description']='no data in db'
    except:
         t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 获取用户已发布的失卡招领信息
@blueprintLostcard.route('/lostcardGetByUser')
def lostcardGetByUser():
    submitid=request.values.get('submitid')
    t={}
    try:
        lostcard=Lostcard.query.filter(submitid==submitid,showflag="true").all()
        length=Lostcard.query.filter(submitid==submitid,showflag="true").count()
        
        db.session.close()
        if length!=0:
            tt={}
            t['status']='true'
            t['data']=[]
            for i in range(length):
                tt={}
                tt['tableid']=lostcard[i].tableid
                tt['name']=lostcard[i].name
                tt['id']=lostcard[i].id
                tt['description']=lostcard[i].description
                tt['contact']=lostcard[i].contact
                tt['type']=lostcard[i].type
                tt['submitid']=lostcard[i].submitid
                tt['date']=lostcard[i].date
                t['data'].append(tt)
        else:
            t['status']='true'
            t['description']='no data in db'

    except:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 获取特定的失卡招领信息
@blueprintLostcard.route('/lostcardGetById')
def lostcardGetById():
    t={}
    tableid=request.values.get('tableid')
    try:
        lostcard=Lostcard.query.filter(tableid==tableid,showflag="true").all()
        length=Lostcard.query.filter(tableid==tableid,showflag="true").count()
        
        db.session.close()
        if length!=0:
            tt={}
            t['data']=[]
            t['status']='true'
            for i in range(length):
                tt={}
                tt['tableid']=lostcard[i].tableid
                tt['name']=lostcard[i].name
                tt['id']=lostcard[i].id
                tt['description']=lostcard[i].description
                tt['contact']=lostcard[i].contact
                tt['type']=lostcard[i].type
                tt['submitid']=lostcard[i].submitid
                t['data'].append(tt)
        else:
            t['description']='no data in db'
            t['status']='true'
    except:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)