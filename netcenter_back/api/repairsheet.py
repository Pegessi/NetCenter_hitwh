#-*- coding: utf-8 -*-
from flask import Flask,request,json, jsonify,Blueprint
from flask_sqlalchemy import SQLAlchemy
from models import Repair,db,Info
from params import mailConfig
import smtplib 
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText    
from email.header import Header 
import time
import chardet
blueprintRepair = Blueprint('repairsheet', __name__)

# 测试
@blueprintRepair.route('/mailtest',methods=['GET','POST'])
def test():
    mail_user = 'hitwhnetcenter@126.com'
    mail_pass = 'hitwhshouquan9'
    receivers = ['yami1455530881@outlook.com,1455530881@qq.com']
    if request.method == 'POST':
        submitid=request.values.get('submitid')
        submitdate=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        repairlocation=request.values.get("repairlocation")
        repairapartment=request.values.get("repairapartment")
        # repairtype=request.values.get("repairtype")
        repairroom=request.values.get("repairroom")
        repairdescription=request.values.get("repairdescription")
        repaircontact=request.values.get("repaircontact")
        repairstatus="待处理"
        username=request.values.get("username")
        previousid=request.values.get("previousid")
        failsolution=''
        

        try:
            
            subject="hitwh网络中心-通知"
            subject=Header(subject, 'utf-8').encode()
            msg = MIMEMultipart('mixed')
            msg['Subject']=subject
            msg['From'] = mail_user
            msg['To'] = ','.join(receivers)
            test = 'test'
            #构造邮件内容
            text ="您有新的报修单待处理哦，请进入小程序进行处理。\n地点："+str(repairapartment)+"-"+str(repairroom)+"\n故障描述："+str(repairdescription)+"\n用户名:"+str(username)+"\n联系方式:"+str(repaircontact)+"\n提交时间:"+str(submitdate)
            text_plain = MIMEText(text,'plain', 'utf-8')  
            msg.attach(text_plain)
            smtp = smtplib.SMTP_SSL('smtp.126.com',465)
            #查看调试信息
            smtp.set_debuglevel(1)
            smtp.login(mail_user,mail_pass) 
            smtp.sendmail(mail_user,msg['To'].split(','),msg.as_string()) 
            smtp.quit()
            print("邮件发送成功")
        except smtplib.SMTPException:
                print("Error: 无法发送邮件")
    return 'mailtest'

# # 邮箱测试
# @blueprintRepair.route('/',methods=['GET','POST'])
# def mailTest():
#     # 构造邮件主题
#     subject="hitwh网络中心-通知"
#     subject=Header(subject, 'utf-8').encode()
#     msg = MIMEMultipart('mixed')
#     msg['Subject']=subject
#     msg['From'] = mailConfig['user']
#     receiver=mailConfig['user']+","+mailConfig['manager']
#     msg['To'] = mailConfig['user']+";"+mailConfig['manager']
#     fname="text.txt"
#     flink="https://savefiles-1257168605.cos.ap-beijing.myqcloud.com/IPandDomain.doc"
#     #构造邮件内容
#     # text = "您有新的报修单待处理哦，请进入小程序进行处理。\n"
#     text = "文件"+flink+"的下载链接：。\n"
#     text_plain = MIMEText(text,'plain', 'utf-8')    
#     msg.attach(text_plain)

#     smtp = smtplib.SMTP()
#     smtp.connect('smtp.126.com',25) 
#     smtp.login(mailConfig['user'],mailConfig['password']) 
#     smtp.sendmail(mailConfig['user'],receiver,msg.as_string()) 
#     smtp.quit()
#     return '0'

# 增加报修单
@blueprintRepair.route('/repairAdd',methods=['GET','POST'])
def repairAdd():
    t={}
    if request.method == 'POST':
        submitid=request.values.get('submitid')
        submitdate=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        repairlocation=request.values.get("repairlocation")
        repairapartment=request.values.get("repairapartment")
        # repairtype=request.values.get("repairtype")
        repairroom=request.values.get("repairroom")
        repairdescription=request.values.get("repairdescription")
        repaircontact=request.values.get("repaircontact")
        repairstatus="待处理"
        username=request.values.get("username")
        previousid=request.values.get("previousid")
        failsolution=''
        if not submitid or not submitdate or not repairlocation or not repairapartment or not repairroom or not repairdescription or not repaircontact or not repairstatus or not username:
        
            t['status']='false'
            t['submitdate']=submitdate
            t['submitid']=submitid
            t['repairlocation']=repairlocation
            t['repairapartment']=repairapartment
            t['repairroom']=repairroom
            t['repairdescription']=repairdescription
            t['repaircontact']=repaircontact
            t['submitname']=username
            t['previousid']=previousid
            t['failsolution']=failsolution
        else:
            
            repair = Repair(submitid=submitid,submitdate=submitdate,repairlocation=repairlocation,repairapartment=repairapartment,repairroom=repairroom,repairdescription=repairdescription,repaircontact=repaircontact,repairstatus=repairstatus,submitname=username,previousid=previousid,failsolution=failsolution,showflag=0)
            db.session.add(repair)
            try:
                db.session.commit()
                t['status']='true'
            except:
                db.session.rollback()
                t['status']='false'
                t['description']='db error'
            db.session.close()

            # 构造邮件主题
            subject="hitwh网络中心-通知"
            subject=Header(subject, 'utf-8').encode()
            msg = MIMEMultipart('mixed')
            msg['Subject']=subject
            msg['From'] = mailConfig['user']
            msg['To'] = ','.join(mailConfig['manager'])
            #构造邮件内容
            text ="您有新的报修单待处理哦，请进入小程序进行处理。\n地点："+str(repairapartment)+"-"+str(repairroom)+"\n故障描述："+str(repairdescription)+"\n用户名:"+str(username)+"\n联系方式:"+str(repaircontact)+"\n提交时间:"+str(submitdate) 
            text_plain = MIMEText(text,'plain', 'utf-8')    
            msg.attach(text_plain)
            #smtp 25端口在服务器经测试不能使用 使用SSl加密发送 端口为465
            smtp = smtplib.SMTP_SSL('smtp.126.com',465)
            #查看调试信息
            #smtp.set_debuglevel(1) 
            smtp.login(mailConfig['user'],mailConfig['password']) 
            smtp.sendmail(mailConfig['user'],msg['To'].split(','),msg.as_string())
            smtp.quit()
            print("发送成功")
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)


# @blueprintRepair.route('/userCheck')
# def userCheck():
#     t={}
#     openid=request.values.get('openid')
#     if not openid:
#         t['status']='false'
#     else:
#         openid=openid
#         user=Info.query.filter_by(openid=openid).first()
#         t['tableid']=user.tableid
#         t['openid']=user.openid
#         t['name']=user.name
#         t['id']=user.id
#         t['identical']=user.identical
#         t['email']=user.email
#     return json.dumps(t,ensure_ascii=False)

# 管理员分配报修单
@blueprintRepair.route('/repairDistribute',methods=['GET','POST'])
def repairDistribute():
    t={}
    email=''
    t['debug']="yes"
    if request.method == 'POST':
        tableid=request.values.get('tableid')
        workmanid=request.values.get("workmanid")
        manageid=request.values.get("manageid")
        identity=request.values.get('identity')
        managedate=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        email=request.values.get("email")
        if not tableid or not workmanid or not manageid or not email:
            t['status']='001'
            t['description']=tableid+'-'+workmanid+'-'+managedate+'-'+email
        elif identity!='1':
            # 无权限
            t['status']='002'
        elif identity=='1':
            repair=Repair.query.filter_by(tableid=tableid).update({'managedate':managedate,'manageid':manageid,'workmanid':workmanid,'repairstatus':'待接单'})
            repair1= Repair.query.filter_by(tableid = tableid).first()
            repairapartment = repair1.repairapartment
            repairroom =repair1.repairroom
            repairdescription =repair1.repairdescription
            username =repair1.submitname
            repaircontact = repair1.repaircontact
            submitdate = repair1.submitdate
            try:
                db.session.commit()
                # 发送邮件给维修人员提示他们
                # 构造邮件主题
                subject="hitwh网络中心-通知"
                subject=Header(subject, 'utf-8').encode()
                msg = MIMEMultipart('mixed')
                msg['Subject']=subject
                msg['From'] = mailConfig['user']
                msg['To'] = email

                #构造邮件内容
                text = "您有新的报修单待处理哦，请进入小程序进行处理。\n地点："+str(repairapartment)+"-"+str(repairroom)+"\n故障描述："+str(repairdescription)+"\n用户名:"+str(username)+"\n联系方式:"+str(repaircontact)+"\n提交时间:"+str(submitdate)   
                text_plain = MIMEText(text,'plain', 'utf-8')    
                msg.attach(text_plain)

                #smtp 25端口在服务器经测试不能使用 使用SSl加密发送 端口为465
                smtp = smtplib.SMTP_SSL('smtp.126.com',465)
                smtp.login(mailConfig['user'],mailConfig['password']) 
                smtp.sendmail(mailConfig['user'],email,msg.as_string()) 
                smtp.quit()
                t['status']='100'
            except:
                db.session.rollback()
                t['status']='003'
                
    else:
        t['status']='004'
    db.session.close()
    return json.dumps(t,ensure_ascii=False)

# 用户删除报修单，只是修改showflag 不是真的删除记录
@blueprintRepair.route('/repairChangeFlag',methods=['GET','POST'])
def repairChangeFlag():  
    t={}
    if request.method == 'POST':
        tableid=request.values.get('tableid')
        if not tableid:
            t['status']='false'
        else:
            tableid=tableid
            repair=Repair.query.filter_by(tableid=tableid).update({'showflag':1})  
            try:
                db.session.commit()
                t['status']='true'
            except:
                db.session.rollback()
                t['status']='false'
                t['description']='db error'
            db.session.close()
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 管理员删除报修单，删除数据库记录
@blueprintRepair.route('/repairDelete',methods=['GET','POST'])
def repairDelete():  
    t={}
    if request.method == 'POST':
        tableid=request.values.get('tableid')
        identity=request.values.get('identity')
        if not tableid:
            t['status']='001'
        elif identity!='1':
            # 无权限
            t['status']='002'
        elif identity=='1':
            Repair.query.filter_by(tableid=tableid).delete()  
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

# 维修人员接受报修单
@blueprintRepair.route('/repairAccept',methods=['GET','POST'])
def repairAccept():  
    t={}
    if request.method == 'POST':
        tableid=request.values.get('tableid')
        if not tableid:
            t['status']='not tableid'
        else:
            
            workdate=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 
            #接单成功
            tableid=tableid
            repair=Repair.query.filter_by(tableid=tableid).update({'repairstatus':'待维修','workdate':workdate})  
            try:
                db.session.commit()
                t['status']='true'
                repair1=Repair.query.filter_by(tableid=tableid).first()
                workmanid=repair1.workmanid
                submitid=repair1.submitid
                user=Info.query.filter_by(id=submitid).first()     #获取用户信息
                email=user.email
                workman=Info.query.filter_by(id=workmanid).first()   #获取维修员信息
                workman_name=workman.name
                workman_phone=workman.phone

                # 发送邮件给用户
                subject="hitwh网络中心-通知"
                subject=Header(subject, 'utf-8').encode()
                msg = MIMEMultipart('mixed')
                msg['Subject']=subject
                msg['From'] = mailConfig['user']
                msg['To'] = email

                #构造邮件内容
                text = "您提交的编号为"+str(tableid)+"的报修单已被接单\n"+"维修员信息为:"+str(workman_name)+"-"+str(workman_phone)+"\n如有疑问可联系维修员或者致电网络中心: 0631-5687184"
                text_plain = MIMEText(text,'plain', 'utf-8')  
                msg.attach(text_plain)

                #smtp 25端口在服务器经测试不能使用 使用SSl加密发送 端口为465
                smtp = smtplib.SMTP_SSL('smtp.126.com',465)
                smtp.login(mailConfig['user'],mailConfig['password']) 
                smtp.sendmail(mailConfig['user'],email,msg.as_string()) 
                smtp.quit()
            except:
                db.session.rollback()
                t['status']='false'
                t['description']='db error'
            db.session.close()

            
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 维修人员拒绝接单
@blueprintRepair.route('/repairRefuse',methods=['GET','POST'])
def repairRefuse():  
    t={}
    if request.method == 'POST':
        tableid=request.values.get('tableid')
        if not tableid:
            t['status']='false'
        else:
            repair=Repair.query.filter_by(tableid=tableid).update({'repairstatus':'待处理','manageid':'','managedate':''})  
            try:
                db.session.commit()
                t['status']='true'
            except:
                db.session.rollback()
                t['status']='false'
                t['description']='db error'
            db.session.close()
    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 维修人员成功维修
@blueprintRepair.route('/repairsuccess',methods=['GET','POST'])
def repairsuccess():  
    t={}
    if request.method == 'POST':
        tableid=request.values.get('tableid')
        comment=request.values.get('comment')
        if not tableid:
            t['status']='false'
        else:
            # 维修成功
            tableid=tableid
            repair=Repair.query.filter_by(tableid=tableid).update({'repairstatus':'已完成','repairreply':comment})  
            try:
                db.session.commit()
                t['status']='true'
                repair1=Repair.query.filter_by(tableid=tableid).first()
                submitid=repair1.submitid
                user=Info.query.filter_by(id=submitid).first()
                email=user.email
            except:
                db.session.rollback()
                t['status']='false'
                t['description']='db error'

            

            db.session.close()

            # 发送邮件给用户
            subject="hitwh网络中心-通知"
            subject=Header(subject, 'utf-8').encode()
            msg = MIMEMultipart('mixed')
            msg['Subject']=subject
            msg['From'] = mailConfig['user']
            msg['To'] = email

            #构造邮件内容
            text = "您提交的编号为"+str(tableid)+"的报修单维修完毕，如有问题请致电网络中心：0631-5687184"
            text_plain = MIMEText(text,'plain', 'utf-8')  
            msg.attach(text_plain)

            #smtp 25端口在服务器经测试不能使用 使用SSl加密发送 端口为465
            smtp = smtplib.SMTP_SSL('smtp.126.com',465)
            smtp.login(mailConfig['user'],mailConfig['password']) 
            smtp.sendmail(mailConfig['user'],email,msg.as_string()) 
            smtp.quit()


    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 维修人员维修失败
@blueprintRepair.route('/repairfail',methods=['GET','POST'])
def repairfail():  
    t={}
    if request.method == 'POST':
        tableid=request.values.get('tableid')
        comment=request.values.get('comment')
        if not tableid or not comment:
            t['status']='false'
        else:
            # 维修失败
            tableid=tableid
            # 创建新的报修单
            repair=Repair.query.filter_by(tableid=tableid).first()
            submitid=repair.submitid
            submitdate=repair.submitdate
            repairlocation=repair.repairlocation
            repairapartment=repair.repairapartment
            repairroom=repair.repairroom
            repairdescription=repair.repairdescription
            repaircontact=repair.repaircontact
            repairstatus="待处理"
            submitname=repair.submitname
            previousid=tableid
            failsolution=comment
            repair=Repair.query.filter_by(tableid=tableid).update({'repairstatus':'未完成','repairreply':comment})  
            try:
                db.session.commit()
                
                repair = Repair(submitid=submitid,submitdate=submitdate,repairlocation=repairlocation,repairapartment=repairapartment,repairroom=repairroom,repairdescription=repairdescription,repaircontact=repaircontact,repairstatus=repairstatus,submitname=submitname,previousid=previousid,failsolution=failsolution)
                db.session.add(repair)
                try:
                    db.session.commit()
                    t['status']='true'
                except:
                    db.session.rollback()

            except Exception as e:
                #加入数据库commit提交失败，必须回滚！！！
                db.session.rollback()
                t['status']='false'

            db.session.close()
            # 给管理员发送邮件
            # 构造邮件主题
            subject="hitwh网络中心-通知"
            subject=Header(subject, 'utf-8').encode()
            msg = MIMEMultipart('mixed')
            msg['Subject']=subject
            msg['From'] = mailConfig['user']
            msg['To'] = mailConfig['manager']

            #构造邮件内容
            text = "有维修单维修失败，已返回到待处理状态，请进入小程序进行处理。\n地点："+str(repairapartment)+"-"+str(repairroom)+"\n故障描述："+str(repairdescription)+"\n故障留言："  +str(comment)
            text_plain = MIMEText(text,'plain', 'utf-8')  
            msg.attach(text_plain)

            #smtp 25端口在服务器经测试不能使用 使用SSl加密发送 端口为465
            smtp = smtplib.SMTP_SSL('smtp.126.com',465)
            smtp.login(mailConfig['user'],mailConfig['password']) 
            smtp.sendmail(mailConfig['user'],mailConfig['manager'],msg.as_string()) 
            smtp.quit()

    else:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 获取所有待处理的报修单给管理人员
@blueprintRepair.route('/repairUnhandled')
def repairUnhandled():
    t={}
    try:
        repair=Repair.query.filter_by(repairstatus='待处理').all()
        length=Repair.query.filter_by(repairstatus='待处理').count()
        db.session.close()
        t['data']=[]
        if length!=0:
            tt={}
            for i in range(length):
                tt={}
                tt['tableid']=repair[i].tableid
                tt['submitdate']=repair[i].submitdate
                tt['failsolution']=repair[i].failsolution
                tt['repairapartment']=repair[i].repairapartment
                tt['repairroom']=repair[i].repairroom
                tt['submitname']=repair[i].submitname
                tt['repairdescription']=repair[i].repairdescription
                tt['repaircontact']=repair[i].repaircontact
                tt['submitid']=repair[i].submitid
                tt['previousid']=repair[i].previousid
                t['data'].append(tt)
        else:
            t['data']=[]
    except:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 获取所有已处理的报修单记录给管理人员
@blueprintRepair.route('/repairHandled')
def repairHandled():
    manageid=request.values.get('manageid')
    t={}
    try:
        repair=Repair.query.filter(Repair.manageid==manageid,Repair.workmanid!='').all()
        length=Repair.query.filter(Repair.manageid==manageid,Repair.workmanid!='').count()
        db.session.close()
        if length!=0:
            t['data']=[]
            t['status']='true'
            for i in range(length):
                tt={}
                tt['tableid']=repair[i].tableid
                tt['failsolution']=repair[i].failsolution
                tt['managedate']=repair[i].managedate
                tt['submitdate']=repair[i].submitdate
                tt['submitname']=repair[i].submitname
                tt['repairapartment']=repair[i].repairapartment
                tt['repairroom']=repair[i].repairroom
                tt['repairdescription']=repair[i].repairdescription
                tt['repairreply']=repair[i].repairreply
                tt['repaircontact']=repair[i].repaircontact
                tt['repairstatus']=repair[i].repairstatus
                tt['submitid']=repair[i].submitid
                tt['workmanid']=repair[i].workmanid
                tt['previousid']=repair[i].previousid
                t['data'].append(tt)
        else:
            t={}
    except:
        t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 获取特定用户所有报修单 给用户
@blueprintRepair.route('/repairGetByUser')
def repairGetByUser():
    submitid=request.values.get('userid')
    t={}
    if not submitid:
        t['status']='false'
        t['description']='no userid'
    else:
        try:
            repair=Repair.query.filter_by(submitid=submitid,showflag=0).all()
            length=Repair.query.filter_by(submitid=submitid,showflag=0).count()
            db.session.close()
            if length!=0:     
                t['data']=[]
                for i in range(length):
                    tt={}
                    tt['repairstatus']=repair[i].repairstatus
                    tt['repairreply']=repair[i].repairreply
                    tt['tableid']=repair[i].tableid
                    tt['submitdate']=repair[i].submitdate
                    tt['managedate']=repair[i].managedate
                    tt['failsolution']=repair[i].failsolution
                    tt['repairapartment']=repair[i].repairapartment
                    tt['repairroom']=repair[i].repairroom
                    tt['repairdescription']=repair[i].repairdescription
                    tt['repaircontact']=repair[i].repaircontact
                    tt['submitid']=repair[i].submitid
                    t['data'].append(tt)
            else:
                t={}
        except:
            t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 取出待接单的报修单给维修人员
@blueprintRepair.route('/repairUnaccepted')
def repairUnaccepted():
    workmanid=request.values.get('userid')
    repairstatus='待接单'
    if not workmanid:
        tt['status']='false'
    else:
        try:
            repair=Repair.query.filter_by(workmanid=workmanid,repairstatus=repairstatus).all()
            length=Repair.query.filter_by(workmanid=workmanid,repairstatus=repairstatus).count()
            
            db.session.close()
            # repair=Repair.query.filter(Repair.workmanid==workmanid,Repair.repairstatus==repairstatus).all()
            # length=Repair.query.filter(Repair.workmanid==workmanid,Repair.repairstatus==repairstatus).count()
            if length!=0:
                t={}
                t['length']=length
                t['data']=[]
                t['status']='true'
                tt={}
                for i in range(length):
                    tt={}
                    tt['tableid']=repair[i].tableid
                    tt['submitdate']=repair[i].submitdate
                    tt['managedate']=repair[i].managedate
                    tt['failsolution']=repair[i].failsolution
                    tt['submitname']=repair[i].submitname
                    tt['repairapartment']=repair[i].repairapartment
                    tt['repairroom']=repair[i].repairroom
                    tt['repairdescription']=repair[i].repairdescription
                    tt['repaircontact']=repair[i].repaircontact
                    tt['submitid']=repair[i].submitid
                    t['data'].append(tt)
            else:
                t={}
        except:
            t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 取出已接单待完成的报修单给维修人员
@blueprintRepair.route('/repairUnfinished')
def repairUnfinished():
    workmanid=request.values.get('userid')
    repairstatus='待维修'
    t={}
    if not workmanid:
        t['status']='false'
        t['description']='no workmanid'
    else:
        try:
            repair=Repair.query.filter(Repair.workmanid==workmanid,Repair.repairstatus==repairstatus).all()
            length=Repair.query.filter(Repair.workmanid==workmanid,Repair.repairstatus==repairstatus).count()
            
            db.session.close()
            if length!=0:
                tt={}
                t['length']=length
                t['data']=[]
                for i in range(length):
                    tt={}
                    tt['tableid']=repair[i].tableid
                    tt['submitdate']=repair[i].submitdate
                    tt['managedate']=repair[i].managedate
                    tt['failsolution']=repair[i].failsolution
                    tt['repairapartment']=repair[i].repairapartment
                    tt['repairroom']=repair[i].repairroom
                    tt['repairdescription']=repair[i].repairdescription
                    tt['repaircontact']=repair[i].repaircontact
                    tt['submitid']=repair[i].submitid
                    tt['submitname']=repair[i].submitname
                    t['data'].append(tt)
            else:
                t={}
        except:
            t['status']='false'
    return json.dumps(t,ensure_ascii=False)

# 读出该维修人员已完成的报修单     
@blueprintRepair.route('/repairFinished')
def repairFinished():
    t={}
    tt={}
    workmanid=request.values.get('userid')
    if not submitid:
        tt['status']='false'
    else:
        try:
            repair=Repair.query.filter(Repair.workmanid==workmanid,Repair.repairstatus.in_(['已完成', '未完成'])).all()
            length=Repair.query.filter(Repair.workmanid==workmanid,Repair.repairstatus.in_(['已完成', '未完成'])).count()
            
            db.session.close()
            if length!=0:
                t['length']=length
                t['data']=[]
                for i in range(length):
                    tt={}
                    tt['tableid']=repair[i].tableid
                    tt['submitdate']=repair[i].submitdate
                    tt['managedate']=repair[i].managedate
                    tt['failsolution']=repair[i].failsolution
                    tt['repairapartment']=repair[i].repairapartment
                    tt['repairroom']=repair[i].repairroom
                    tt['repairdescription']=repair[i].repairdescription
                    tt['repairreply']=repair[i].repairreply
                    tt['repairstatus']=repair[i].repairstatus
                    tt['submitname']=repair[i].submitname
                    tt['submitid']=repair[i].submitid
                    t['data'].append(tt)
            else:
                t={}
        except:
            tt['status']='false'
            t.append(tt)
    return json.dumps(t,ensure_ascii=False)

# 读出该维修人员的所有报修单     
@blueprintRepair.route('/repairWorkman')
def repairWorkman():
    t={}
    tt={}
    workmanid=request.values.get('id')
    if not workmanid:
        tt['status']='false'
    else:
        try:
            repair=Repair.query.filter(Repair.workmanid==workmanid).all()
            length=Repair.query.filter(Repair.workmanid==workmanid).count()
            db.session.close()
            if length!=0:
                t['data']=[]
                t['length']=length
                t['status']='true'
                for i in range(length):
                    tt={}
                    tt['tableid']=repair[i].tableid
                    tt['submitdate']=repair[i].submitdate
                    tt['managedate']=repair[i].managedate
                    tt['workdate']=repair[i].workdate
                    tt['failsolution']=repair[i].failsolution
                    tt['repairapartment']=repair[i].repairapartment
                    tt['repairroom']=repair[i].repairroom
                    tt['repairdescription']=repair[i].repairdescription
                    tt['repairreply']=repair[i].repairreply
                    tt['repairstatus']=repair[i].repairstatus
                    tt['submitname']=repair[i].submitname
                    tt['submitid']=repair[i].submitid
                    t['data'].append(tt)
            else:
                t={}
        except:
            t['status']='false'
    return json.dumps(t,ensure_ascii=False)



# 读出该维修人员手头上所有报修单     
@blueprintRepair.route('/repairforworkman')
def repairforworkman():
    t={}
    tt={}
    workmanid=request.values.get('id')
    if not workmanid:
        tt['status']='false'
    else:
        try:
            repair=Repair.query.filter(Repair.workmanid==workmanid,Repair.repairstatus.in_(['待接单', '待维修'])).all()
            length=Repair.query.filter(Repair.workmanid==workmanid,Repair.repairstatus.in_(['待接单', '待维修'])).count()
            db.session.close()
            if length!=0:
                t['data']=[]
                t['length']=length
                t['status']='true'
                for i in range(length):
                    tt={}
                    tt['tableid']=repair[i].tableid
                    tt['submitdate']=repair[i].submitdate
                    tt['managedate']=repair[i].managedate
                    tt['failsolution']=repair[i].failsolution
                    tt['repairapartment']=repair[i].repairapartment
                    tt['repairroom']=repair[i].repairroom
                    tt['repairdescription']=repair[i].repairdescription
                    tt['submitid']=repair[i].submitid
                    tt['repairstatus']=repair[i].repairstatus
                    tt['submitname']=repair[i].submitname
                    tt['submitid']=repair[i].submitid
                    t['data'].append(tt)
            else:
                t={}
        except:
            t['status']='false'
    return json.dumps(t,ensure_ascii=False)