# coding:utf-8
from flask import Flask,request,json, jsonify,Blueprint
from flask_sqlalchemy import SQLAlchemy
from models import Question,db,QuestionType

blueprintQuestion = Blueprint('question', __name__)

# 添加问题指南
@blueprintQuestion.route('/questionAdd',methods=['GET','POST'])
def questionAdd():
    tmp={}
    if request.method == 'POST':
        description=request.values.get('description')
        identity=request.values.get('identity')
        ttype=request.values.get("type")
        solution=request.values.get("solution")
        if not solution or not ttype or not description:
            tmp['status']='001'
            tmp['description']=description
            tmp['type']=ttype
            tmp['solution']=solution
        elif identity!='1':
            # 无权限
            tmp['status']='002'
        elif identity=='1':
            length=Question.query.filter_by(description=description).count()
            if length!=0:
                # 数据重复
                tmp['status']='003'
            else:

                question = Question(description=description,type=ttype,solution=solution)
                db.session.add(question)
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

# 获取所有问题及解决方法
@blueprintQuestion.route('/questionGet')
def questionGet():
    t={}
    tt={}
    question=Question.query.all()
    length=Question.query.count()
    # questionType=QuestionType.query.all()
    # length2=QuestionType.query.count()
    db.session.close()         
    if length!=0:
        t['data']=[]
        for i in range(length):
            tt={}
            tt['solution']=question[i].solution
            tt['type']=question[i].type
            tt['description']=question[i].description
            
            t['data'].append(tt)
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)
    
# 获取所有问题及解决方法
@blueprintQuestion.route('/questionGetAll')
def questionGetAll():
    t={}
    tt={}
    question=Question.query.all()
    length1=Question.query.count()
    questionType=QuestionType.query.all()
    length2=QuestionType.query.count()
    db.session.close()
    if length1!=0:
        t['status']='true'
        t['data']={}
        # length2是类型数量
        # 初始化 t['data']
        for i in range(length2):
            type=questionType[i].type
            t['data'][type]=[]
        # length1是问题数量
        for i in range(length1):
            # 每一个问题的type对应类型的id
            for j in range(length2):
                # 如果问题的type等于type的id，则为此类型
                # print('question.type')
                # print(question[i].type)
                # print('questionType.id')
                # print(questionType[j].id)
                if int(question[i].type)==int(questionType[j].id):
                    
                    # 找到对应的类型
                    qtype=questionType[j].type
                    tt={}
                    tt['solution']=question[i].solution
                    tt['description']=question[i].description
                    tt['type']=question[i].type
                    t['data'][qtype].append(tt)   
                else:
                    t['length1']=length1
                    t['length2']=length2
                    continue        
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)


# 增加问题分类
@blueprintQuestion.route('/questionTypeAdd',methods=['GET','POST'])
def questionTypeAdd():
    tmp={}
    if request.method == 'POST':
        ttype=request.values.get("type")
        identity=request.values.get('identity')
        if not ttype:
            tmp['status']='001'
        elif identity!='1':
            # 无权限
            tmp['status']='002'
        elif identity=='1':
            questionType = QuestionType(type=ttype)
            db.session.add(questionType)
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

# 修改问题指南
@blueprintQuestion.route('/questionModify',methods=['GET','POST'])
def questionModify():  
    t={}
    if request.method == 'POST':
        description=request.values.get('description')
        solution=request.values.get('solution')
        identity=request.values.get('identity')
        if not description or not solution:
            t['status']='001'
        elif identity!='1':
            # 无权限
            t['status']='002'
        elif identity=='1':
            question=Question.query.filter_by(description=description).update({'solution':solution})  
            try:
                db.session.commit()
                t['status']='100'
            except:
                db.session.rollback()
                t['status']='003'
            db.session.close()
    else:
        t['status']='004'
    return json.dumps(t,ensure_ascii=False)

# 管理员删除问题指南，删除数据库记录
@blueprintQuestion.route('/questionDelete',methods=['GET','POST'])
def questionDelete():  
    t={}
    if request.method == 'POST':
        description=request.values.get('description')
        identity=request.values.get('identity')
        if not description:
            t['status']='001'
        elif identity!='1':
            # 无权限
            t['status']='002'
        elif identity=='1':
            question=Question.query.filter_by(description=description).first()
            
            db.session.delete(question)
            try:
                db.session.commit()
                t['status']='100'
            except:
                db.session.rollback()
                t['status']='003'
            db.session.close()
    else:
        t['status']='004'
    return json.dumps(t,ensure_ascii=False)

@blueprintQuestion.route('/questionTypeGetAll')
def questionTypeGetAll():
    t=[]
    tt={}
    questionType=QuestionType.query.all()
    length=QuestionType.query.count()
    db.session.close()
    if length!=0:
        for i in range(length):
            tt={}
            tt['id']=questionType[i].id
            tt['type']=questionType[i].type
            t.append(tt)
    else:
        tt['status']='false'
        t.append(tt)
    return json.dumps(t,ensure_ascii=False)

# 问题类型列表
@blueprintQuestion.route('/questionTypeGet')
def questionTypeGet():
    t=[]
    tt={}
    questionType=QuestionType.query.all()
    length=QuestionType.query.count()
    db.session.close()
    if length!=0:
        for i in range(length):
            tt={}
            # tt['id']=questionType[i].id
            # tt['type']=questionType[i].type
            tt=questionType[i].type
            t.append(tt)
            
    else:
        tt['status']='false'
        t.append(tt)
    return json.dumps(t,ensure_ascii=False)


# 修改问题分类
@blueprintQuestion.route('/typeModify',methods=['GET','POST'])
def typeModify():  
    t={}
    if request.method == 'POST':
        typeId=request.values.get('id')
        identity=request.values.get('identity')
        typeDescription=request.values.get('type')
        if not typeId or not typeDescription:
            t['status']='001'
        elif identity!='1':
            # 无权限
            t['status']='002'
        elif identity=='1':
            typee=QuestionType.query.filter_by(id=typeId).update({'type':typeDescription})  
            try:
                db.session.commit()
                t['status']='100'
            except:
                db.session.rollback()
                t['status']='003'
                t['description']='db error'
            db.session.close()
    else:
        t['status']='004'
    return json.dumps(t,ensure_ascii=False)

# 管理员删除问题分类，删除数据库记录
@blueprintQuestion.route('/typeDelete',methods=['GET','POST'])
def typeDelete():  
    t={}
    if request.method == 'POST':
        iid=request.values.get('id')
        identity=request.values.get('identity')
        if not iid:
            t['status']='001'
            t['description']="no id"
        elif identity!='1':
            # 无权限
            t['status']='002'
        elif identity=='1':
            length=Question.query.filter_by(type=iid).count()
            if length==0:
                typee=QuestionType.query.filter_by(id=iid).first()
                if typee!=None:
                    db.session.delete(typee)
                    try:
                        db.session.commit()
                        t['status']='100'
                    except:
                        db.session.rollback()
                        t['status']='003'
                    db.session.close()
                else:
                    t['status']='003'
                    t['description']='no such type'+iid
            else:
                t['status']="002"            
    else:
        t['status']='004'
    return json.dumps(t,ensure_ascii=False)
