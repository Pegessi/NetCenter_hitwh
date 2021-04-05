from flask import Flask,request,json,Blueprint
from models import db,WxInfo

app = Flask(__name__)
blueprintWxInfo = Blueprint('wxinfo',__name__)

@blueprintWxInfo.route('/wxinfoAdd',methods=['POST'])
def wxinfoAdd():
    tmp={}
    if request.method =='POST':
        openid=request.values.get('openid')
        name_wx=request.values.get('name_wx')
        image_wx=request.values.get('image_wx')
        if not openid or not name_wx or not image_wx:
            tmp['status']='false'
            tmp['openid']=openid
            tmp['name_wx']=name_wx
            tmp['image_wx']-image_wx

        else:
            try:
                wxinfo = WxInfo(openid=openid,name_wx=name_wx,image_wx=image_wx)
                db.session.add(wxinfo)
                db.session.commit()
            except:
                app.logger.error("Error in wxinfoAdd",exc_info=True)
                db.session.rollback() 
            finally:
                db.session.close()
                tmp['status']='true'

    else:
        tmp['status']='false'
    return json.dumps(tmp,ensure_ascii=False)

@blueprintWxInfo.route('/getWxInfo')
def getWxInfo():
    t=[]
    wxinfo = WxInfo.query.all()
    length = WxInfo.query.count()
    db.session.close()
    if length != 0:
        for i in range(length):
            tt={}
            tt['id']=wxinfo[i].id
            tt['openid']=wxinfo[i].openid
            tt['name_wx']=wxinfo[i].name_wx
            tt['image_wx']=wxinfo[i].image_wx
            t.append(tt)
    else:
        tt={}
        tt['status']='false'
        t.append(tt)
    return json.dumps(t,ensure_ascii=False)
