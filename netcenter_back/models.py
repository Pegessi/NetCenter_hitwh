# Orm table declarations
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Info(db.Model):
    __tablename__="info"
    tableid=db.Column(db.Integer(),primary_key=True)
    openid=db.Column(db.String(30))
    id=db.Column(db.String(20))
    name=db.Column(db.String(10))
    identity=db.Column(db.String(1))
    email=db.Column(db.String(50))
    phone=db.Column(db.String(20))

class Repair(db.Model):
    __tablename__="repairsheet"
    tableid=db.Column(db.Integer(),primary_key=True)
    submitid=db.Column(db.String(20))
    submitdate=db.Column(db.String(20))
    manageid=db.Column(db.String(20))
    managedate=db.Column(db.String(20))
    workmanid=db.Column(db.String(20))
    workdate=db.Column(db.String(20))
    previousid=db.Column(db.String(20))
    repairlocation=db.Column(db.String(20))
    repairapartment=db.Column(db.String(20))
    repairroom=db.Column(db.String(20))
    repairdescription=db.Column(db.String(50))
    repaircontact=db.Column(db.String(20))
    repairstatus=db.Column(db.String(20))
    repairreply=db.Column(db.String(100))
    failsolution=db.Column(db.String(60))
    userformid=db.Column(db.String(20))
    submitname=db.Column(db.String(10))
    showflag=db.Column(db.Integer())

class File(db.Model):
    __tablename__="File"
    tableid=db.Column(db.Integer(),primary_key=True)
    fname=db.Column(db.String(30))
    flink=db.Column(db.String(50))
    submitid=db.Column(db.String(20))
    content=db.Column(db.Text())
    
class Lostcard(db.Model):
    __tablename__="lostcard"
    tableid=db.Column(db.Integer(),primary_key=True)
    name=db.Column(db.String(10))
    id=db.Column(db.String(20))
    description=db.Column(db.String(100))
    date=db.Column(db.String(50))
    type=db.Column(db.String(1))
    contact=db.Column(db.String(20))
    submitid=db.Column(db.String(20))
    showflag=db.Column(db.Integer())
        
class Question(db.Model):
    __tablename__="question"
    description=db.Column(db.String(255),primary_key=True)
    solution=db.Column(db.Text())
    type=db.Column(db.String(2))

class QuestionType(db.Model):
    __tablename__="type"
    id=db.Column(db.Integer(),primary_key=True)
    type=db.Column(db.String(255))
    
class Notice(db.Model):
    __tablename__="notice"
    id=db.Column(db.Integer(),primary_key=True)
    title = db.Column(db.String(100))
    link = db.Column(db.String(100))
    date = db.Column(db.String(20))
class Test(db.Model):
    __tablename__ = "test"
    id=db.Column(db.Integer(),primary_key=True)
    name=db.Column(db.String(20))
class Push(db.Model):
    __tablename__="push"
    name=db.Column(db.String(100),primary_key=True)
    imgurl=db.Column(db.String(100))
    link=db.Column(db.String(100))

class VsInfo(db.Model):
    __tablename__= "vsinfo"
    id=db.Column(db.Integer(),primary_key=True)
    name = db.Column(db.String(100))
    link = db.Column(db.String(100))
    sponsor = db.Column(db.String(100))
    level = db.Column(db.String(100))
    register_time = db.Column(db.String(100))
    play_time = db.Column(db.String(100))

class WxInfo(db.Model):
    __tablename__="wxinfo"
    id = db.Column(db.Integer(),primary_key=True)
    openid = db.Column(db.String(100))
    name_wx = db.Column(db.String(100))
    image_wx = db.Column(db.String(100))